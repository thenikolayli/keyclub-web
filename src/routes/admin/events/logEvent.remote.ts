import { form } from "$app/server";
import * as v from "valibot";
import { getDocsService, getSheetsService } from "$lib/google";
import { docsUrlToId, parseBaseEvent } from "$lib/events/events";
import { eventsMembersSheetInfo, eventsSheetInfo } from "$lib/sheetsConfig";
import { SPREADSHEET_ID } from "$env/static/private";
import { tokenizeName, matchesAllTokens } from "$lib/members/tokenizeName";
import type { Result } from "$lib/responses";
import type { MemberAttendance, BaseEvent } from "$lib/events/types";
import {fail, ok} from "$lib/responses";

// Logs a volunteer event from its attendance document.
// Writes calculated hours back into the attendance doc, then appends the event to the Events sheet and
// the member hours to the EventsMembers sheet.
// Returns which members were logged vs not logged.
export const logEvent = form(
  v.object({
    url: v.pipe(v.string(), v.nonEmpty(), v.trim(), v.url()),
  }),
  async ({ url }): Promise<Result<{
    event: BaseEvent;
    membersLogged: MemberAttendance[];
    membersNotLogged: MemberAttendance[];
  }>> => {
    const idResult = docsUrlToId(url);
    if (!idResult.ok) {
      return fail(idResult.error);
    }

    const documentId = idResult.data;
    const docs = getDocsService();
    const sheets = getSheetsService();

    const eventInfo = await parseBaseEvent(documentId, docs);
    if (!eventInfo.ok) {
      return fail(eventInfo.error);
    }
    const { event, memberAttendance } = eventInfo.data;

    // Creates a batch of updates to the attendance doc to calculate hours.
    // Checks volunteer sign-in and -out times and calculates hours logged
    // + finds the index of the cell where to input the calculated hours.
    const attendanceUpdateRequests = batchRequests(memberAttendance);
    if (attendanceUpdateRequests.length > 0) {
      try {
        await docs.documents.batchUpdate({
          documentId,
          requestBody: { requests: attendanceUpdateRequests },
        });
      } catch (error) {
        return fail("Failed to batch update requests for attendance doc.", error);
      }
    }

    // Finds next empty row to log new event attendance
    const emptyRowEventsMembersResult = await findNextEmptyRowNoDupes(
      sheets,
      eventsMembersSheetInfo.events,
      event.name!,
    );
    if (!emptyRowEventsMembersResult.ok) {
      return emptyRowEventsMembersResult;
    }

    const createUpdateValuesResult = await createUpdateValues(sheets, memberAttendance, event.name!);
    if (!createUpdateValuesResult.ok) {
      return createUpdateValuesResult;
    }
    const {
      updateValues: eventsMembersUpdateValues,
      membersLogged,
      membersNotLogged,
    } = createUpdateValuesResult.data;

    // Finds next empty row to log new event
    const emptyRowEventsResult = await findNextEmptyRowNoDupes(
      sheets,
      eventsSheetInfo.events,
      event.name!,
    );
    if (!emptyRowEventsResult.ok) {
      return emptyRowEventsResult;
    }

    // the Events sheet only has name, total hours, and attendance doc link.
    // all other info is stored on supabase, not in the sheet.
    const eventsUpdateValues = [event.name, event.total_hours, event.attendance_url];

    try {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: [
            {
              range: `${eventsMembersSheetInfo.sheetName}!A${emptyRowEventsMembersResult.data}:${indexToCol(
                eventsMembersUpdateValues.length - 1,
              )}${emptyRowEventsMembersResult.data}`,
              values: [eventsMembersUpdateValues],
            },
            {
              range: `${eventsSheetInfo.sheetName}!A${emptyRowEventsResult.data}:C${emptyRowEventsResult.data}`,
              values: [eventsUpdateValues],
            },
          ],
        },
      });
    } catch (error) {
      return fail("Failed to update hours spreadsheet during event logging.", error);
    }

    return ok({
      event,
      membersLogged,
      membersNotLogged,
    });
  },
);

// Finds the columns of members in the EventsMembers sheet and builds a row of
// hours (with the event name in column A)
async function createUpdateValues(
  sheets: ReturnType<typeof getSheetsService>,
  memberAttendance: MemberAttendance[],
  eventName: string,
): Promise<
  Result<{
    updateValues: (string | number | null)[];
    membersLogged: MemberAttendance[];
    membersNotLogged: MemberAttendance[];
  }>
> {
  let namesResponse;
  try {
    namesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: eventsMembersSheetInfo.members,
    });
  } catch (error) {
    return fail("Issue fetching member columns from sheet while logging event.", error);
  }

  const headerRow = namesResponse.data.values?.[0] ?? [];
  const updateValues: (number | null)[] = new Array(headerRow.length).fill(null);
  const matched = new Set<MemberAttendance>();

  for (let index = 0; index < headerRow.length; index++) {
    const sheetTokens = tokenizeName(String(headerRow[index] ?? ""));
    const member = memberAttendance.find((m) =>
      matchesAllTokens(m.tokenizedName, sheetTokens),
    );
    if (member) {
      updateValues[index] = member.hours;
      matched.add(member);
    }
  }

  const membersLogged = [...matched];
  const membersNotLogged = memberAttendance.filter((m) => !matched.has(m));

  // member headers start at column B (config uses B1:ZZ1); prepend event name for column A
  const values = [eventName, ...updateValues];

  return ok({
    updateValues: values,
    membersLogged,
    membersNotLogged,
  });
}

// Builds a batch of requests to write calculated hours into the attendance doc
function batchRequests(memberAttendance: MemberAttendance[]) {
  const requests: any[] = [];

  for (const member of memberAttendance) {
    const update = writeHoursToCell(member);
    // Members with no logged hours are left blank in the doc
    if (!update) continue;

    requests.push({ insertText: update.insertRequest });
    if (update.deleteRequest) {
      requests.push({ deleteContentRange: update.deleteRequest });
    }
  }

  // Returned in reverse, so updates happen backwards and don't offset start indexes
  return requests.reverse();
}

// Writes/overwrites calculated hours into the hours cell,
// or null if the member has no hours to write
function writeHoursToCell(member: MemberAttendance) {
  if (member.hours == null) return null;

  const text = member.hours.toFixed(2);
  // If the cell is blank, just insert it
  if (member.hoursEndIndex === member.hoursStartIndex) {
    return {
      deleteRequest: null,
      insertRequest: { text, location: { index: member.hoursStartIndex } },
    };
  }
  // Otherwise, delete the existing content and insert the new hours
  return {
    deleteRequest: {
      range: {
        startIndex: member.hoursStartIndex,
        endIndex: member.hoursEndIndex,
      },
    },
    insertRequest: { text, location: { index: member.hoursStartIndex } },
  };
}

// Finds the next empty row of a sheet and makes sure the event isn't already
// logged. Takes searchRange because it's used for both Events and EventsMembers.
async function findNextEmptyRowNoDupes(
  sheets: ReturnType<typeof getSheetsService>,
  searchRange: string,
  eventName: string,
): Promise<Result<string>> {
  let response;
  try {
    response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: searchRange,
    });
  } catch (error) {
    return fail("Issue fetching events from sheet while logging event.", error);
  }

  for (const row of response.data.values ?? []) {
    if (row[0] === eventName) {
      return fail(`Event ${eventName} already logged in sheet`);
    }
  }

  return ok(String((response.data.values?.length ?? 0) + 2));
}

// converts a numerical index to a column letter (1 -> A, 2 -> B, 27 -> AA, etc)
function indexToCol(index: number): string {
  let result = "";
  index++;
  while (index > 0) {
    index--;
    result = String.fromCharCode("A".charCodeAt(0) + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
}

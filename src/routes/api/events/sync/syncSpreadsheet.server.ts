import { supabase } from "$lib/db/admin";
import { getSheetsService } from "$lib/google";
import { SPREADSHEET_ID } from "$env/static/private";
import { parseDateField, parseTimeField } from "$lib/datetime";
import type { Result } from "$lib/types/responses";

const SHEET_NAME = "2026-2027 Events";

const RANGES = [
  `${SHEET_NAME}!A2:A`, // name
  `${SHEET_NAME}!B2:B`, // date
  `${SHEET_NAME}!C2:C`, // start_time
  `${SHEET_NAME}!D2:D`, // end_time
  `${SHEET_NAME}!E2:E`, // address
  `${SHEET_NAME}!F2:F`, // n_slots
  `${SHEET_NAME}!G2:G`, // n_volunteers
  `${SHEET_NAME}!H2:H`, // total_hours
  `${SHEET_NAME}!I2:I`, // leaders
  `${SHEET_NAME}!J2:J`, // made_by
];

type Parser<T> = (v: string) => T;

export async function syncSpreadsheet(): Promise<Result<number>> {
  const sheets = getSheetsService();

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: RANGES,
  });

  const valueRanges = response.data.valueRanges;
  if (!valueRanges || valueRanges.length === 0) {
    return { ok: false, error: "No data returned from spreadsheet" };
  }

  const length = valueRanges[0].values?.length ?? 0;
  if (length === 0) {
    return { ok: false, error: "No members found." };
  }

  const { data: deleteResult, error: deleteError } = await supabase
    .from("spreadsheet_events")
    .delete()
    .not("id", "is", null);
  if (deleteError) {
    return { ok: false, error: deleteError?.message };
  }

  const names = normalize(valueRanges[0].values ?? [], length, Parsers.string);
  const dates = normalize(valueRanges[1].values ?? [], length, Parsers.dates);
  const start_times = normalize(valueRanges[2].values ?? [], length, Parsers.times);
  const end_times = normalize(valueRanges[3].values ?? [], length, Parsers.times);
  const addresses = normalize(valueRanges[4].values ?? [], length, Parsers.string);
  const n_slots = normalize(valueRanges[5].values ?? [], length, Parsers.int);
  const n_volunteers = normalize(valueRanges[6].values ?? [], length, Parsers.int);
  const total_hours = normalize(valueRanges[7].values ?? [], length, Parsers.float);
  const leaders = normalize(valueRanges[8].values ?? [], length, Parsers.stringArray);
  const made_by = normalize(valueRanges[9].values ?? [], length, Parsers.string);

  let synced = 0;

  for (let i = 0; i < length; i++) {
    let date = dates[i];
    if (!date) {
      // some events are formatted (m/dd) Event Name
      date = parseDateField(names[i].split(")")[0].substring(1));
    }

    const { error: insertError } = await supabase
      .from("spreadsheet_events")
      .insert({
        name: names[i],
        date,
        start_time: start_times[i],
        end_time: end_times[i],
        address: addresses[i],
        n_slots: n_slots[i],
        n_volunteers: n_volunteers[i],
        total_hours: total_hours[i],
        leaders: leaders[i],
        made_by: made_by[i],
      });
    if (insertError) {
      console.error("syncSpreadsheet: upsert failed for", names[i], insertError);
      continue;
    }

    synced++;
  }

  return { ok: true, data: synced };
}

const Parsers = {
  string: ((s: string) => s) as Parser<string>,
  stringArray: ((s: string) => s.split(",")) as Parser<string[]>,
  dates: parseDateField as Parser<string | null>,
  times: parseTimeField as Parser<string | null>,
  float: ((s: string) => {
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }) as Parser<number>,
  int: ((s: string) => {
    const n = parseInt(s, 10);
    return isNaN(n) ? 0 : n;
  }) as Parser<number>,
  bool: ((s: string) =>
    s.toLowerCase() === "true" ||
    s.toLowerCase() === "yes" ||
    s === "1") as Parser<boolean>,
};

function normalize<T>(values: any[][], length: number, parse: Parser<T>): T[] {
  const out: T[] = new Array(length).fill(null).map(() => parse(""));
  for (let i = 0; i < Math.min(values.length, length); i++) {
    if (values[i] && values[i][0] != null) {
      const v = values[i][0];
      const parsed = parse(String(v));
      out[i] = parsed;
    }
  }
  return out;
}

function formatPhoneNumber(raw: string): string {
  const cleaned = raw.replace(/[\s\-\(\)]/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return raw;
}

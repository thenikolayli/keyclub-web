import { supabaseAdmin } from "$lib/db/admin";
import { getSheetsService } from "$lib/google";
import { SPREADSHEET_ID } from "$env/static/private";
import { ok, fail } from "$lib/responses";
import type { Result } from "$lib/responses";
import { membersSheetInfo } from "$lib/sheetsConfig";

type Parser<T> = (v: string) => T;

export async function syncMembers(): Promise<Result<number>> {
  const sheets = getSheetsService();

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: [
      membersSheetInfo.names,
      membersSheetInfo.all_hours,
      membersSheetInfo.term_hours,
      membersSheetInfo.grad_year,
      membersSheetInfo.class,
      membersSheetInfo.strikes,
      membersSheetInfo.personal_email,
      membersSheetInfo.school_email,
      membersSheetInfo.phone_number,
      membersSheetInfo.shirt_size,
      membersSheetInfo.paid_dues,
    ],
  });

  const valueRanges = response.data.valueRanges;
  if (!valueRanges || valueRanges.length === 0) {
    return fail("No data returned from spreadsheet");
  }

  const length = valueRanges[0].values?.length ?? 0;
  if (length === 0) {
    return fail("No members found.");
  }

  const names = normalize(valueRanges[0].values ?? [], length, Parsers.string);
  const allHours = normalize(
    valueRanges[1].values ?? [],
    length,
    Parsers.float,
  );
  const termHours = normalize(
    valueRanges[2].values ?? [],
    length,
    Parsers.float,
  );
  const gradYears = normalize(valueRanges[3].values ?? [], length, Parsers.int);
  const classes = normalize(
    valueRanges[4].values ?? [],
    length,
    Parsers.string,
  );
  const strikes = normalize(valueRanges[5].values ?? [], length, Parsers.int);
  const personalEmails = normalize(
    valueRanges[6].values ?? [],
    length,
    Parsers.string,
  );
  const schoolEmails = normalize(
    valueRanges[7].values ?? [],
    length,
    Parsers.string,
  );
  const phoneNumbers = normalize(
    valueRanges[8].values ?? [],
    length,
    Parsers.string,
  );
  const shirtSizes = normalize(
    valueRanges[9].values ?? [],
    length,
    Parsers.string,
  );
  const paidDues = normalize(
    valueRanges[10].values ?? [],
    length,
    Parsers.bool,
  );

  let synced = 0;

  for (let i = 0; i < length; i++) {
    const phone = formatPhoneNumber(phoneNumbers[i]);
    const { error: upsertError } = await supabaseAdmin
      .from("members")
      .upsert({
        name: names[i],
        all_hours: allHours[i],
        term_hours: termHours[i],
        grad_year: gradYears[i],
        class: classes[i],
        strikes: strikes[i],
        personal_email: personalEmails[i],
        school_email: schoolEmails[i],
        phone_number: phone,
        shirt_size: shirtSizes[i],
        paid_dues: paidDues[i],
      }, { onConflict: "name", ignoreDuplicates: false });
    if (upsertError) {
      console.error("syncMembers: upsert failed for", names[i], upsertError);
      continue;
    }

    synced++;
  }

  return ok(synced);
}

const Parsers = {
  string: ((s: string) => s) as Parser<string>,
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

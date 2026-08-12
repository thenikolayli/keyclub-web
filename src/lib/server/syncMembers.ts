import { supabaseAdmin as supabase } from "$lib/db/admin";
import { getSheetsService } from "./google";
import { SPREADSHEET_ID } from "$env/static/private";
import { randomUUID } from "node:crypto";
import type { Result } from "$lib/types/responses";

const SHEET_NAME = "2025-2026 Members";

const RANGES = [
  `${SHEET_NAME}!A2:A`, // names
  `${SHEET_NAME}!B2:B`, // all_hours
  `${SHEET_NAME}!C2:C`, // term_hours
  `${SHEET_NAME}!D2:D`, // grad_year
  `${SHEET_NAME}!E2:E`, // class
  `${SHEET_NAME}!F2:F`, // strikes
  `${SHEET_NAME}!G2:G`, // personal_email
  `${SHEET_NAME}!H2:H`, // school_email
  `${SHEET_NAME}!I2:I`, // phone_number
  `${SHEET_NAME}!J2:J`, // shirt_size
  `${SHEET_NAME}!K2:K`, // paid_dues
];

type Parser<T> = (v: string) => T;

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

export async function syncMembers(): Promise<Result<number>> {
  const sheets = getSheetsService();

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: RANGES,
  });

  const valueRanges = response.data.valueRanges;
  if (!valueRanges || valueRanges.length === 0) {
    return { ok: false, error: new Error("No data returned from spreadsheet") };
  }

  const length = valueRanges[0].values?.length ?? 0;
  if (length === 0) {
    return { ok: false, error: new Error("No members found.") };
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
    const name = names[i];
    if (!name) continue;

    const phone = formatPhoneNumber(phoneNumbers[i]);
    const now = new Date().toISOString();
    const id = randomUUID();

    const existing = await supabase
      .from("members")
      .select("id, name, created_at")
      .eq("name", name)
      .maybeSingle();

    if (existing.error && existing.error.code !== "PGRST116") {
      console.error("syncMembers: lookup failed for", name, existing.error);
      continue;
    }

    if (existing.data) {
      const { error: updateErr } = await supabase
        .from("members")
        .update({
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
          updated_ad: now,
        })
        .eq("id", existing.data.id);

      if (updateErr) {
        console.error("syncMembers: update failed for", name, updateErr);
        continue;
      }
    } else {
      const { error: insertErr } = await supabase.from("members").insert({
        id,
        name,
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
        created_at: now,
        updated_ad: now,
      });

      if (insertErr) {
        console.error("syncMembers: insert failed for", name, insertErr);
        continue;
      }
    }

    synced++;
  }

  return { ok: true, data: synced };
}

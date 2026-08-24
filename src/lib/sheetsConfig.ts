// The EventsMembers sheet is a sheet that logs how many hours which volunteers volunteered
// at which events. The columns are volunteer names and rows are event names.
// The intersection of any non-header row/column is a cell that logs the number of hours
// that volunteer attended that event.
export const eventsMembersSheet = {
  sheetName: "2026-2027 EventsMembers",
  events: "2026-2027 EventsMembers!A2:A",
  members: "2026-2027 EventsMembers!B1:ZZ1",
};

// The Events sheet has a simple 3-column schema so it can be logged manually with ease:
// A = event name, B = total hours, C = attendance doc link.
// All other event info is stored on supabase, not in this sheet.
export const eventsSheet = {
  sheetName: "2026-2027 Events",
  events: "2026-2027 Events!A2:A",
  totalHours: "2026-2027 Events!B2:B",
  links: "2026-2027 Events!C2:C",
};

// The Members sheet contains information about every member.
export const membersSheet = {
  sheetName: "2026-2027 Members",
  names: "2026-2027 Members!A2:A",
  all_hours: "2026-2027 Members!B2:B",
  term_hours: "2026-2027 Members!C2:C",
  grad_year: "2026-2027 Members!D2:D",
  class: "2026-2027 Members!E2:E",
  strikes: "2026-2027 Members!F2:F",
  personal_email: "2026-2027 Members!G2:G",
  school_email: "2026-2027 Members!H2:H",
  phone_number: "2026-2027 Members!I2:I",
  shirt_size: "2026-2027 Members!J2:J",
  paid_dues: "2026-2027 Members!K2:K",
};

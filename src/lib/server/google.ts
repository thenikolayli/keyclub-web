import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./google_key.json",
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

export const getCalendarService = () =>
  google.calendar({ version: "v3", auth });
export const getDocsService = () => google.docs({ version: "v1", auth });
export const getSheetsService = () => google.sheets({ version: "v4", auth });

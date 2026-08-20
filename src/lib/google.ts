import { google } from "googleapis";
import { GOOGLE_KEY_BASE64 } from "$env/static/private";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(Buffer.from(GOOGLE_KEY_BASE64, "base64").toString("utf-8")),
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

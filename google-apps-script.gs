// Google Apps Script backend for the wedding RSVP + outfit form
// 1) Open https://script.google.com
// 2) Create a new project
// 3) Paste this code in the editor
// 4) Save the project
// 5) Deploy > New deployment > Web app
// 6) Set Execute as: Me
// 7) Set Who has access: Anyone
// 8) Copy the Web App URL into the SCRIPT_URL value in index.html

const SHEET_NAME = "WeddingResponses";

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    "submittedAt",
    "source",
    "name",
    "attendance",
    "phone",
    "guestGender",
    "responseSummary",
    "rawData"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  return sheet;
}

function normalizePayload(rawPayload) {
  if (!rawPayload) return {};

  if (typeof rawPayload === "string") {
    try {
      return JSON.parse(rawPayload);
    } catch (e) {
      return { raw: rawPayload };
    }
  }

  return rawPayload;
}

function buildResponseSummary(data) {
  const summaryParts = [];

  if (data.guestGender) summaryParts.push(`Gender: ${data.guestGender}`);
  if (data.attendance) summaryParts.push(`Attendance: ${data.attendance}`);
  if (data.phone) summaryParts.push(`Phone: ${data.phone}`);

  const extraKeys = Object.keys(data)
    .filter((key) => !["submittedAt", "source", "name", "attendance", "phone", "guestGender"].includes(key))
    .sort();

  if (extraKeys.length) {
    const extraText = extraKeys
      .map((key) => `${key}: ${data[key]}`)
      .join(" | ");
    summaryParts.push(extraText);
  }

  return summaryParts.join(" | ") || "No details";
}

function doPost(e) {
  try {
    const payload = normalizePayload(e && e.postData && e.postData.contents ? e.postData.contents : {});
    const sheet = getOrCreateSheet();
    const row = [
      payload.submittedAt || new Date().toISOString(),
      payload.source || "unknown",
      payload.name || "",
      payload.attendance || "",
      payload.phone || "",
      payload.guestGender || "",
      buildResponseSummary(payload),
      JSON.stringify(payload)
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: "Saved to sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Wedding RSVP backend is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

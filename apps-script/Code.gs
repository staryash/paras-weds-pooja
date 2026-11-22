/**
 * Reply-card receiver for the wedding website.
 *
 * Paste this into: Google Sheet → Extensions → Apps Script → Code.gs
 * Then run `setup` once, and deploy as a Web app (see README.md).
 */

var SHEET_NAME = 'RSVPs';
var SUMMARY_NAME = 'Summary';
var TZ = 'Asia/Kolkata';
var HEADERS = [
  'Submitted at (IST)', 'Attending', 'Name', 'Mobile', 'Arrival date', 'Arrival time',
  'Total guests', 'Adults', 'Children', 'Blessing / message', 'Language', 'Submission ID'
];
var ID_COL = 12; // column L

/** Run once from the editor: creates the sheets, headers and a live summary. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);

  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#2b0f26').setFontColor('#f3dc98');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('dd mmm yyyy, h:mm am/pm');
  sh.getRange('E:E').setNumberFormat('ddd, d mmm yyyy');
  sh.getRange('G:I').setNumberFormat('0');
  sh.setColumnWidth(3, 220); sh.setColumnWidth(10, 320); sh.setColumnWidth(12, 140);

  var s = SHEET_NAME + '!';
  var sm = ss.getSheetByName(SUMMARY_NAME) || ss.insertSheet(SUMMARY_NAME, 1);
  sm.clear();
  sm.getRange('A1:B7').setValues([
    ['Families coming', '=COUNTIF(' + s + 'B2:B, "Yes")'],
    ['Total guests', '=SUMIF(' + s + 'B2:B, "Yes", ' + s + 'G2:G)'],
    ['Adults', '=SUMIF(' + s + 'B2:B, "Yes", ' + s + 'H2:H)'],
    ['Children', '=SUMIF(' + s + 'B2:B, "Yes", ' + s + 'I2:I)'],
    ['Unable to come (sent blessings)', '=COUNTIF(' + s + 'B2:B, "No")'],
    ['', ''],
    ['Arrivals by date', '']
  ]);
  sm.getRange('A1:A7').setFontWeight('bold');
  sm.getRange('A8').setFormula(
    '=IFERROR(QUERY(' + s + 'B2:I, "select E, count(E), sum(G), sum(H), sum(I) where B = \'Yes\' and E is not null group by E order by E ' +
    'label E \'Arrival date\', count(E) \'Families\', sum(G) \'Guests\', sum(H) \'Adults\', sum(I) \'Children\'", 0), "No replies yet")'
  );
  sm.getRange('A9:A40').setNumberFormat('ddd, d mmm yyyy');
  sm.setColumnWidth(1, 240);
  sm.getRange('D1').setValue('Note: if a family replies twice, both rows are kept (newest at the bottom).').setFontStyle('italic').setFontColor('#777777');
}

function doGet() {
  return ContentService.createTextOutput('Reply endpoint is running.');
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var p = (e && e.parameter) || {};

    // Honeypot: real guests never fill this hidden field.
    if (p.website) return json_({ ok: true });

    var attending = p.attending === 'no' ? 'No' : 'Yes';
    var name = clean_(p.name, 100);
    var id = clean_(p.id, 64);
    if (!name || name.length < 2) return json_({ ok: false, error: 'Name is required' });

    var arrival = '', total = 0, kids = 0;
    if (attending === 'Yes') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.arrivalDate || '')) return json_({ ok: false, error: 'Arrival date is required' });
      var parts = p.arrivalDate.split('-');
      arrival = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      total = clampInt_(p.totalPeople, 1, 60, 1);
      kids = clampInt_(p.kids, 0, total - 1, 0);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { setup(); sh = ss.getSheetByName(SHEET_NAME); }

    // Ignore retries of the same submission.
    var last = sh.getLastRow();
    if (id && last > 1) {
      var hit = sh.getRange(2, ID_COL, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
      if (hit) return json_({ ok: true, duplicate: true });
    }

    sh.appendRow([
      new Date(),
      attending,
      name,
      p.phone ? "'" + String(p.phone).replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20) : '', // kept as text
      arrival,
      attending === 'Yes' ? clean_(p.arrivalTime, 12) : '',
      attending === 'Yes' ? total : '',
      attending === 'Yes' ? total - kids : '',
      attending === 'Yes' ? kids : '',
      clean_(p.message, 600),
      p.lang === 'hi' ? 'Hindi' : 'English',
      id
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/** Trim, cap length, and neutralise spreadsheet formulas (=, +, -, @). */
function clean_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function clampInt_(v, min, max, dflt) {
  var n = parseInt(v, 10);
  if (isNaN(n)) n = dflt;
  return Math.max(min, Math.min(max, n));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Google Sheets integration via Google Apps Script Web App.
 *
 * SETUP (una sola vez):
 * 1. Crea un Google Sheet en tu Drive.
 * 2. Extensions > Apps Script > pega el siguiente código:
 *
 * ──────────────────────────────────────────────────────────
 * function doPost(e) {
 *   try {
 *     var data = JSON.parse(e.postData.contents);
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     var sheetName = data.tipo || 'General';
 *     var tab = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
 *     var fields = Object.keys(data).filter(k => k !== 'tipo');
 *     if (tab.getLastRow() === 0) tab.appendRow(['Fecha', ...fields]);
 *     tab.appendRow([new Date().toLocaleString('es-ES'), ...fields.map(f => data[f])]);
 *     return ContentService.createTextOutput(JSON.stringify({ok:true}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch(err) {
 *     return ContentService.createTextOutput(JSON.stringify({ok:false,error:err.message}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * ──────────────────────────────────────────────────────────
 *
 * 3. Deploy > New deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copia la URL del deployment y ponla en .env:
 *    VITE_SHEETS_URL=https://script.google.com/macros/s/XXX/exec
 */

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL as string | undefined

export async function enviarASheets(
  tipo: string,
  datos: Record<string, string | number | boolean>
): Promise<void> {
  if (!SHEETS_URL) {
    console.warn('[sheets] VITE_SHEETS_URL no configurada — datos no enviados')
    return
  }

  try {
    // mode: 'no-cors' — Google Apps Script no devuelve CORS headers,
    // pero el POST llega correctamente al script.
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, ...datos }),
    })
  } catch {
    // Silent fail — el formulario sigue mostrando éxito al usuario
  }
}

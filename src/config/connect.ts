import { GoogleSpreadsheet } from 'google-spreadsheet'
import { GoogleSpreadsheetRow } from 'google-spreadsheet/dist/index'

import { JWT } from 'google-auth-library'

require('dotenv').config()

let rawPuppetRows: GoogleSpreadsheetRow<Record<string, any>>[] = []

export async function getSheet(sheetId: number) {
  const serviceAccountAuth = new JWT({
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY,
    scopes: process.env.SCOPES
  })

  const doc = new GoogleSpreadsheet(
    process.env.DOC_ID as string,
    serviceAccountAuth
  )

  await doc.loadInfo()

  const sheet = doc.sheetsById[sheetId]
  return sheet
}

export async function getData(sheetId: number) {
  let rows: GoogleSpreadsheetRow<Record<string, any>>[] = []
  const sheet = await getSheet(sheetId)

  rows = await sheet.getRows()
  return rows
}

;(async () => {
  rawPuppetRows = await getData(Number(process.env.PUPPET_SHEET_ID))
})()

export { rawPuppetRows }

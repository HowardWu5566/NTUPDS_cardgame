import express, { Request, Response } from 'express'
import { engine } from 'express-handlebars'
import { getData } from './config/connect'
require('dotenv').config()

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
  res.render('home')
})

app.get('/game', async (req: Request, res: Response) => {
  const puppetSheetId: number = Number(process.env.PUPPET_SHEET_ID)
  const rows = await getData(puppetSheetId)
  // console.log(rows)
  res.render('game')
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})

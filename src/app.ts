import express, { Request, Response } from 'express'
import { engine } from 'express-handlebars'
import { getData } from './config/connect'
import { Game } from './models/Game'
require('dotenv').config()

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
  return res.render('home')
})

app.get('/game', async (req: Request, res: Response) => {
  const level: string = req.query.level as string
  const game = new Game(level)
  await game.start()

  return res.render('game', { game })
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})

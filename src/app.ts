import express, { Request, Response } from 'express'
import { engine } from 'express-handlebars'
import { Game } from './models/Game'
import { Ranking } from './models/Ranking'
require('dotenv').config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
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

app.get('/ranking', async (req: Request, res: Response) => {
  const ranking = new Ranking()
  const masterArr = await ranking.getRanking()

  return res.render('ranking', { masterArr })
})

app.post('/ranking', async (req: Request, res: Response) => {
  const ranking = new Ranking()
  const { name, score } = req.body

  await ranking.postRanking(name, Number(score))
  await ranking.organize()

  return res.redirect('/ranking')
})

app.get('/threshold', async (req: Request, res: Response) => {
  const ranking = new Ranking()
  const threshold = await ranking.getThreshold()
  return res.status(200).json(threshold)
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})

import express, { Request, Response, NextFunction } from 'express'
import { engine } from 'express-handlebars'
import { Game } from './models/Game'
import { Ranking } from './models/Ranking'
require('dotenv').config()

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.render('home')
  } catch (err) {
    next(err)
  }
})

app.get('/game', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const level: string = req.query.level as string
    const game = new Game(level)
    await game.start()

    return res.render('game', { game })
  } catch (err) {
    next(err)
  }
})

app.get('/ranking', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ranking = new Ranking()
    const masterArr = await ranking.getRanking()

    return res.render('ranking', { masterArr })
  } catch (err) {
    next(err)
  }
})

app.post(
  '/ranking',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ranking = new Ranking()
      const { name, score } = req.body
      if (name.length > 10) {
        return res.status(400).render('error', { errMsg: '不得超過 10 字元' })
      }

      await ranking.postRanking(name, Number(score))
      await ranking.organize()

      return res.redirect('/ranking')
    } catch (err) {
      next(err)
    }
  }
)

app.get(
  '/threshold',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ranking = new Ranking()
      const threshold = await ranking.getThreshold()
      return res.status(200).json(threshold)
    } catch (err) {
      next(err)
    }
  }
)

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).render('error', { errMsg: '找不到此頁面' })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errMsg = '未預期的錯誤'
  return res.status(500).render('error', { errMsg })
})

app.listen(PORT, () => {
  console.log('listening on port 3000')
})

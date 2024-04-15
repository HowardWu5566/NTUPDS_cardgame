import express, { Request, Response } from 'express'
import { engine } from 'express-handlebars'

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req: Request, res: Response) => {
  res.render('home')
})

app.get('/game', (req: Request, res: Response) => {
  res.render('game')
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})

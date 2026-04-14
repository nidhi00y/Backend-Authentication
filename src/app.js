import express from 'express'
import morgan from 'morgan'
import authrouter from './routes/user.route.js'
import cookie from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cookie())

app.use('/api/v1/auth',authrouter)

export default app;

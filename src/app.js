import express from 'express'
import morgan from 'morgan'
import authrouter from './config/routes/user.route.js'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/auth',authrouter)

export default app;

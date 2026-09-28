import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import authRoutes from '../Routes/auth.routes.js'
import productRoute from '../Routes/product.routes.js'

const app = express()


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(cookieparser())



app.use('/api/auth', authRoutes)

app.use('/api/product', productRoute)

export default app
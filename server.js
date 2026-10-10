import express from 'express'
import dbConnector from './config/dbConnector.js'
import router from './routes/allRoutes.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

dbConnector()

app.use("/api",router)

app.get("/" ,(req , res) => {
    res.json({message : "The     server is running"})
})


app.listen(PORT,()=> {
    console.log(`{message : "Server is running on port ${PORT}"}`)
})
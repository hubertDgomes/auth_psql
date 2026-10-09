import express from 'express'
import dbConnector from './config/dbConnector.js'
import router from './routes/allRoutes.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

const app = express()

const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())


dbConnector()

app.use("/api",router)

app.get("/" ,(req , res) => {
    res.json({message : "The     server is running"})
})


app.listen(PORT,()=> {
    console.log(`{message : "Server is running on port ${PORT}"}`)
})
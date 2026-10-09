import express from 'express'
import dbConnector from './config/dbConnector.js'
import router from './routes/allRoutes.js'
import cookieParser from 'cookie-parser'


const app = express()


app.use(express.json())
app.use(cookieParser())


dbConnector()

app.use("/api",router)

app.get("/" ,(req , res) => {
    res.json({message : "The server is running"})
})


app.listen(3000,()=> {
    console.log("The server is working!")
})
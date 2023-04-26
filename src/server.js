import "./config/config.js"
import express from 'express'
import fs from "fs"
import path from "path"

const PORT = process.env.PORT || 3001
const app = express()
import fileUpload from 'express-fileupload'

app.use(express.static(path.join(process.cwd(), 'files')))
//middlewares
app.use(express.json())
app.use(fileUpload())
// app.use(express.static(path.join(process.cwd(), 'files')))

app.get('/', (req, res) => res.send("Hello"))



import database from "./config/db.js"


// routes
import authRouter from './routes/auth.js'
import usersRouter from "./routes/user.js"
import exp from "constants"

!async function () {
    try {
        database()
        app.use(authRouter)
        app.use(usersRouter)
    } catch (error) {
        console.log(error)
    }
    app.use((error, req, res, next) => {

        fs.appendFileSync('./log.txt', `${req.url}__${req.method}__${Date.now()}__${error.name}__${error.message}\n`)

        if (error.name == 'ValidationError') {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                errorName: error.name,
                error: true,
            })
        }


        if (error.status != 500) {
            error.status = error.status ? error.status : 404
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                errorName: error.name,
                error: true,
            })
        }


        return res.status(error.status).json({
            status: error.status,
            message: 'Internal Server Error',
            errorName: error.name,
            error: true,
        })
    })
    app.listen(PORT, () => console.log(`🚀 BackEnd server is running http://localhost:` + PORT))
}()
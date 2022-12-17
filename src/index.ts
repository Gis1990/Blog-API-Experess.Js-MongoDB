import express, {Request, Response} from "express"
import cors from 'cors'
import {postsRouter} from "./routes/posts-router";
import {blogsRouter} from "./routes/blogs-router";
import {runDb} from "./repositories/db";
import {commentsRouter} from "./routes/comments-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {testingRouter} from "./routes/testing-router";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routes/security-router";


const corsOptions = {
    credentials: true,
}

export const app = express()

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

const port = process.env.PORT || 500

app.get("/", (req:Request,res:Response)=>{
    res.send("Hello!")
})

app.use('/auth',authRouter)

app.use('/blogs',blogsRouter)

app.use('/posts',postsRouter)

app.use('/comments',commentsRouter)

app.use('/users',usersRouter)

app.use("/security",securityRouter)

app.use("/testing",testingRouter)



const startApp=async ()=>{
    await runDb()
    app.listen(port,async () => {
    console.log(`My app listening on port ${port}`)
})}

 startApp().then(r => console.log("App started"))


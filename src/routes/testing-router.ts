import {Request, Response, Router} from "express";
import {BlogsModelClass, CommentsModelClass, PostsModelClass, UsersAccountModelClass} from "../repositories/db";

export const testingRouter = Router({});



testingRouter.delete("/all-data",
    async (req: Request, res: Response) => {
        await BlogsModelClass.deleteMany({});
        await PostsModelClass.deleteMany({})
        await CommentsModelClass.deleteMany({})
        await UsersAccountModelClass.deleteMany({})
        res.sendStatus(204)
    })
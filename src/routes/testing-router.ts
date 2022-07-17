import {Request, Response, Router} from "express";
import {BloggersModel, CommentsModel, PostsModel, UsersAccountModel} from "../repositories/db";

export const testingRouter = Router({});



testingRouter.delete("/all-data",
    async (req: Request, res: Response) => {
        await BloggersModel.deleteMany({});
        await PostsModel.deleteMany({})
        await CommentsModel.deleteMany({})
        await UsersAccountModel.deleteMany({})
        res.sendStatus(204)
    })
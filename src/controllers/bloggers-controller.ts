import {Request, Response} from "express";
import {BloggersService} from "../domain/bloggers-service";





export class BloggersController{
    constructor(protected  bloggersService: BloggersService) {}
    async getAllBloggers (req: Request, res: Response) {
        const allBloggers= await this.bloggersService.getAllBloggers(req.query)
        res.json(allBloggers)
    }
    async getBlogger(req: Request, res: Response) {
        const blogger= await this.bloggersService.getBloggerById(req.params.bloggerId)
        res.json(blogger)
    }
    async createBlogger(req: Request, res: Response) {
        const newBlogger= await this.bloggersService.createBlogger(req.body.name,req.body.youtubeUrl)
        res.status(201).json(newBlogger)
    }
    async updateBlogger(req: Request, res: Response) {
        await this.bloggersService.updateBlogger(req.params.bloggerId, req.body.name, req.body.youtubeUrl)
        res.sendStatus(204)
    }
    async deleteBlogger(req: Request, res: Response) {
        await this.bloggersService.deleteBlogger(req.params.bloggerId)
        res.sendStatus(204)
    }
}





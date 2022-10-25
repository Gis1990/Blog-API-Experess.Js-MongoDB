import {Request, Response} from "express";
import {BlogsService} from "../domain/blogs-service";


export class BlogsController {
    constructor(protected  blogsService: BlogsService) {}
    async getAllBlogs (req: Request, res: Response) {
        const allBlogs= await this.blogsService.getAllBlogs(req.query)
        res.json(allBlogs)
    }
    async getBlog(req: Request, res: Response) {
        const blog= await this.blogsService.getBlogById(req.params.blogId)
        res.json(blog)
    }
    async createBlog(req: Request, res: Response) {
        const newBlog= await this.blogsService.createBlog(req.body.name,req.body.youtubeUrl)
        res.status(201).json(newBlog)
    }
    async updateBlog(req: Request, res: Response) {
        await this.blogsService.updateBlog(req.params.blogId, req.body.name, req.body.youtubeUrl)
        res.sendStatus(204)
    }
    async deleteBlog(req: Request, res: Response) {
        await this.blogsService.deleteBlog(req.params.blogId)
        res.sendStatus(204)
    }
}





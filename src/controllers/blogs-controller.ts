import {Request, Response} from "express";
import {BlogsService} from "../domain/blogs-service";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) protected  blogsService: BlogsService,
                @inject(BlogsQueryRepository) protected  blogsQueryRepository: BlogsQueryRepository) {}
    async getAllBlogs (req: Request, res: Response) {
        const allBlogs= await this.blogsQueryRepository.getAllBlogs(req.query)
        res.json(allBlogs)
    }
    async getBlog(req: Request, res: Response) {
        const blog= await this.blogsQueryRepository.getBlogById(req.params.blogId)
        res.json(blog)
    }
    async createBlog(req: Request, res: Response) {
        const newBlog= await this.blogsService.createBlog(req.body.name,req.body.description,req.body.websiteUrl)
        res.status(201).json(newBlog)
    }
    async updateBlog(req: Request, res: Response) {
        await this.blogsService.updateBlog(req.params.blogId,req.body.name, req.body.description, req.body.websiteUrl)
        res.sendStatus(204)
    }
    async deleteBlog(req: Request, res: Response) {
        await this.blogsService.deleteBlog(req.params.blogId)
        res.sendStatus(204)
    }
}





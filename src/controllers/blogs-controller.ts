import {Request, Response} from "express";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {inject, injectable} from "inversify";
import {CreateBlogUseCase} from "../domain/use-cases/blogs/create-blog-use-case";
import {UpdateBlogUseCase} from "../domain/use-cases/blogs/update-blog-use-case";
import {DeleteBlogUseCase} from "../domain/use-cases/blogs/delete-blog-use-case";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsQueryRepository) private  blogsQueryRepository: BlogsQueryRepository,
                @inject(CreateBlogUseCase) private  createBlogUseCase: CreateBlogUseCase,
                @inject(UpdateBlogUseCase) private  updateBlogUseCase: UpdateBlogUseCase,
                @inject(DeleteBlogUseCase) private  deleteBlogUseCase: DeleteBlogUseCase) {}

    async getAllBlogs (req: Request, res: Response) {
        const allBlogs= await this.blogsQueryRepository.getAllBlogs(req.query)
        res.json(allBlogs)
    }
    async getBlog(req: Request, res: Response) {
        const blog= await this.blogsQueryRepository.getBlogById(req.params.blogId)
        res.json(blog)
    }
    async createBlog(req: Request, res: Response) {
        const newBlog= await this.createBlogUseCase.execute(req.body.name,req.body.description,req.body.websiteUrl)
        res.status(201).json(newBlog)
    }
    async updateBlog(req: Request, res: Response) {
        await this.updateBlogUseCase.execute(req.params.blogId,req.body.name, req.body.description, req.body.websiteUrl)
        res.sendStatus(204)
    }
    async deleteBlog(req: Request, res: Response) {
        await this.deleteBlogUseCase.execute(req.params.blogId)
        res.sendStatus(204)
    }
}





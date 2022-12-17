import {Request, Response} from "express";
import {PostsService} from "../domain/posts-service";
import {PostsQueryService} from "../domain/posts-query-service";

export class PostsController {
    constructor(protected postsService: PostsService,
                protected postsQueryService: PostsQueryService) {}
    async getAllPosts (req: Request, res: Response) {
        const allPosts= await this.postsQueryService.getAllPosts(req.query,req.user?.id)
        res.status(200).json(allPosts)
    }
    async getPost(req: Request, res: Response) {
        const post= await this.postsQueryService.getPostById(req.params.postId,req.user?.id)
        res.status(200).json(post)
    }
    async createPost(req: Request, res: Response) {
        const newPost= await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
        res.status(201).json(newPost)
    }
    async createPostWithExtendedData(req: Request, res: Response) {
        const newPost= await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.status(201).json(newPost)
    }
    async updatePost(req: Request, res: Response) {
        await this.postsService.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.sendStatus(204)
    }
    async deletePost(req: Request, res: Response) {
        await this.postsService.deletePost(req.params.postId)
        res.sendStatus(204)
    }
    async getAllPostsForSpecificBlog(req: Request, res: Response) {
        const posts =await this.postsQueryService.getAllPostsForSpecificBlog(req.query,req.params.blogId,req.user?.id)
        res.status(200).json(posts)

    }
    async likeOperation(req: Request, res: Response) {
        await this.postsService.likeOperation(req.params.postId,req.user!.id,req.user!.login,req.body.likeStatus)
        res.sendStatus(204)
    }
}




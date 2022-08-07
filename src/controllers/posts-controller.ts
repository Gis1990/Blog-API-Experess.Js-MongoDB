import {Request, Response} from "express";
import {PostsService} from "../domain/posts-service";



export class PostsController {
    constructor(protected postsService: PostsService) {}
    async getAllPosts (req: Request, res: Response) {
        const allPosts= await this.postsService.getAllPosts(req.query)
        res.json(allPosts)
    }
    async getPost(req: Request, res: Response) {
        const post= await this.postsService.getPostById(req.params.postId)
        res.json(post)
    }
    async createPost(req: Request, res: Response) {
        const newPost= await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.bloggerId)
        const {_id,...newPostRest}=newPost
        res.status(201).json(newPostRest)
    }
    async createPostWithExtendedData(req: Request, res: Response) {
        const newPost= await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        const {_id,usersLikesInfo,...newPostRest}=newPost
        res.status(201).json(newPostRest)
    }
    async updatePost(req: Request, res: Response) {
        await this.postsService.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        res.sendStatus(204)
    }
    async deletePost(req: Request, res: Response) {
        await this.postsService.deletePost(req.params.postId)
        res.sendStatus(204)
    }
    async getAllPostsForSpecificBlogger(req: Request, res: Response) {
        const posts =await this.postsService.getAllPostsForSpecificBlogger(req.query,req.params.bloggerId)
        res.json(posts)
    }
    async likeOperation(req: Request, res: Response) {
        await this.postsService.likeOperation(req.params.postId,req.user!.id,req.user!.login,req.body.likeStatus)
        res.sendStatus(204)
    }
}




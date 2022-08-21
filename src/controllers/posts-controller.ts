import {Request, Response} from "express";
import {PostsService} from "../domain/posts-service";

export class PostsController {
    constructor(protected postsService: PostsService) {}
    async getAllPosts (req: Request, res: Response) {
        const allPosts= await this.postsService.getAllPosts(req.query)
        if (req.user){
            for (let i=0; i<allPosts.items.length; i++){
                allPosts.items[i].extendedLikesInfo.newestLikes=allPosts.items[i].extendedLikesInfo.newestLikes.slice(-3).sort((a,b)=>b.addedAt.getTime()-a.addedAt.getTime())
                allPosts.items[i].extendedLikesInfo.myStatus=await this.postsService.returnUsersLikeStatus(allPosts.items[i].id, req.user!.id)
            }
            res.status(200).json(allPosts)
        }
        else{
            allPosts.items.forEach(elem=>elem.extendedLikesInfo.myStatus="None")
            allPosts.items.forEach(elem=>elem.extendedLikesInfo.newestLikes=elem.extendedLikesInfo.newestLikes.slice(-3).sort((a,b)=>b.addedAt.getTime()-a.addedAt.getTime()))
            res.status(200).json(allPosts)
        }
    }
    async getPost(req: Request, res: Response) {
        const post= await this.postsService.getPostById(req.params.postId)
        post!.extendedLikesInfo.newestLikes=post!.extendedLikesInfo.newestLikes.slice(-3).sort((a,b)=>b.addedAt.getTime()-a.addedAt.getTime())
        if (req.user){
            post!.extendedLikesInfo.myStatus=await this.postsService.returnUsersLikeStatus(req.params.postId, req.user!.id)
            res.json(post)
        }
        else{
            post!.extendedLikesInfo.myStatus="None"
            res.status(200).json(post)
        }
    }
    async createPost(req: Request, res: Response) {
        const newPost= await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.bloggerId)
        const {_id,usersLikesInfo,...newPostRest}=newPost
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
        if (req.user){
            for (let i=0; i<posts.items.length; i++){
                posts.items[i].extendedLikesInfo.newestLikes=posts.items[i].extendedLikesInfo.newestLikes.slice(-3).sort((a,b)=>b.addedAt.getTime()-a.addedAt.getTime())
                posts.items[i].extendedLikesInfo.myStatus=await this.postsService.returnUsersLikeStatus(posts.items[i].id, req.user!.id)
            }
            res.status(200).json(posts)
        }
        else{
            posts.items.forEach(elem=>elem.extendedLikesInfo.newestLikes=elem.extendedLikesInfo.newestLikes.slice(-3).sort((a,b)=>b.addedAt.getTime()-a.addedAt.getTime()))
            posts.items.forEach(elem=>elem.extendedLikesInfo.myStatus="None")
            res.status(200).json(posts)
        }
    }
    async likeOperation(req: Request, res: Response) {
        await this.postsService.likeOperation(req.params.postId,req.user!.id,req.user!.login,req.body.likeStatus)
        res.sendStatus(204)
    }
}




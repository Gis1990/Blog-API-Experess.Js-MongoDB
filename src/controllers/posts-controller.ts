import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {DeletePostUseCase} from "../domain/use-cases/posts/delete-post-use-case";
import {CreatePostUseCase} from "../domain/use-cases/posts/create-post-use-case";
import {UpdatePostUseCase} from "../domain/use-cases/posts/update-post-use-case";
import {LikeOperationForPostUseCase} from "../domain/use-cases/posts/like-operation-for-post-use-case";
import {PostsQueryRepository} from "../repositories/query-repositories/posts-query-repository";

@injectable()
export class PostsController {
    constructor(@inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(CreatePostUseCase) private createPostUseCase: CreatePostUseCase,
                @inject(UpdatePostUseCase) private updatePostUseCase: UpdatePostUseCase,
                @inject(DeletePostUseCase) private deletePostUseCase: DeletePostUseCase,
                @inject(LikeOperationForPostUseCase) private likeOperationForPostUseCase: LikeOperationForPostUseCase) {}
    async getAllPosts (req: Request, res: Response) {
        const allPosts= await this.postsQueryRepository.getAllPosts(req.query,req.user?.id)
        res.status(200).json(allPosts)
    }
    async getPost(req: Request, res: Response) {
        const post= await this.postsQueryRepository.getPostById(req.params.postId,req.user?.id)
        res.status(200).json(post)
    }
    async createPost(req: Request, res: Response) {
        const newPost= await this.createPostUseCase.execute(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
        res.status(201).json(newPost)
    }
    async createPostWithExtendedData(req: Request, res: Response) {
        const newPost= await this.createPostUseCase.execute(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.status(201).json(newPost)
    }
    async updatePost(req: Request, res: Response) {
        await this.updatePostUseCase.execute(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.sendStatus(204)
    }
    async deletePost(req: Request, res: Response) {
        await this.deletePostUseCase.execute(req.params.postId)
        res.sendStatus(204)
    }
    async getAllPostsForSpecificBlog(req: Request, res: Response) {
        const posts =await this.postsQueryRepository.getAllPostsForSpecificBlog(req.query,req.params.blogId,req.user?.id)
        res.status(200).json(posts)

    }
    async likeOperation(req: Request, res: Response) {
        await this.likeOperationForPostUseCase.execute(req.params.postId,req.user!.id,req.user!.login,req.body.likeStatus)
        res.sendStatus(204)
    }
}




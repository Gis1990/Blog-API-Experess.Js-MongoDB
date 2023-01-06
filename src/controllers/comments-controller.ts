import {Request, Response} from "express";
import {CommentsService} from "../domain/comments-service";
import {inject, injectable} from "inversify";
import {CreateCommentUseCase} from "../domain/use-cases/comments/create-comment-use-case";
import {UpdateCommentUseCase} from "../domain/use-cases/comments/update-comment-use-case";
import {DeleteCommentUseCase} from "../domain/use-cases/comments/delete-comment-use-case";
import {LikeOperationForCommentUseCase} from "../domain/use-cases/comments/like-operation-for-comment-use-case";

@injectable()
export class CommentsController{
    constructor(@inject(CommentsService) private commentsService: CommentsService,
                @inject(CreateCommentUseCase) private  createCommentUseCase: CreateCommentUseCase,
                @inject(UpdateCommentUseCase) private  updateCommentUseCase: UpdateCommentUseCase,
                @inject(DeleteCommentUseCase) private  deleteCommentUseCase: DeleteCommentUseCase,
                @inject(LikeOperationForCommentUseCase) private  likeOperationForCommentUseCase: LikeOperationForCommentUseCase) {}
    async getComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId,req.user?.id)
        res.status(200).json(comment)
    }
    async getAllCommentsForSpecificPost(req: Request, res: Response) {
        const comments = await this.commentsService.getAllCommentsForSpecificPost(req.query, req.params.postId,req.user?.id)
        res.status(200).json(comments)
    }
    async createComment(req: Request, res: Response) {
        const newComment = await this.createCommentUseCase.execute(req.body.content,req.params.postId, req.user!)
        res.status(201).json(newComment)
    }
    async updateComment(req: Request, res: Response) {
        const isUpdated = await this.updateCommentUseCase.execute(req.params.commentId, req.body.content,req.user?.id)
        if (isUpdated) {
            res.sendStatus(204)
        }else{
            res.sendStatus(403)
        }
    }
    async deleteComment(req: Request, res: Response) {
        const isDeleted = await this.deleteCommentUseCase.execute(req.params.commentId,req.user?.id)
        if (isDeleted) {
            res.sendStatus(204)
        }else{
            res.sendStatus(403)
        }
    }
    async likeOperation(req: Request, res: Response) {
        await this.likeOperationForCommentUseCase.execute(req.params.commentId,req.user!.id,req.body.likeStatus)
        res.sendStatus(204)
    }
}




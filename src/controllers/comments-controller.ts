import {Request, Response} from "express";
import {CommentsService} from "../domain/comments-service";


export class CommentsController{
    constructor(protected commentsService: CommentsService,) {}
    async getComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId,req.user?.id)
        res.status(200).json(comment)
    }
    async getAllCommentsForSpecificPost(req: Request, res: Response) {
        const comments = await this.commentsService.getAllCommentsForSpecificPost(req.query, req.params.postId,req.user?.id)
        res.status(200).json(comments)
    }
    async createComment(req: Request, res: Response) {
        const newComment = await this.commentsService.createComment(req.body.content,req.params.postId, req.user!)
        res.status(201).json(newComment)
    }
    async updateComment(req: Request, res: Response) {
        const isUpdated = await this.commentsService.updateCommentById(req.params.commentId, req.body.content,req.user?.id)
        if (isUpdated) {
            res.sendStatus(204)
        }else{
            res.sendStatus(403)
        }
    }
    async deleteComment(req: Request, res: Response) {
        const isDeleted = await this.commentsService.deleteCommentById(req.params.commentId,req.user?.id)
        if (isDeleted) {
            res.sendStatus(204)
        }else{
            res.sendStatus(403)
        }
    }
    async likeOperation(req: Request, res: Response) {
        await this.commentsService.likeOperation(req.params.commentId,req.user!.id,req.body.likeStatus)
        res.sendStatus(204)
    }
}




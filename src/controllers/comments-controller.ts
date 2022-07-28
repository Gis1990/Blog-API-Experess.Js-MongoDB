import {Request,Response} from "express";
import {CommentsService} from "../domain/comments-service";


export class CommentsController{
    constructor(protected commentsService: CommentsService) {}
    async getComment(req: Request, res: Response) {
            const comment = await this.commentsService.getCommentById(req.params.commentId)
            res.json(comment)
    }
    async getAllCommentsForSpecificPost(req: Request, res: Response) {
        const comments = await this.commentsService.getAllCommentsForSpecificPost(req.query, req.params.postId)
        res.status(200).json(comments)
    }
    async createComment(req: Request, res: Response) {
        const newComment = await this.commentsService.createComment(req.body.content,req.params.postId, req.user!)
        const {_id,postId,...newCommentRest}=newComment
        res.status(201).json(newCommentRest)
    }
    async updateComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (req.user?.id!==comment?.userId) {
            res.sendStatus(403)
            return
        }
        await this.commentsService.updateCommentById(req.params.commentId, req.body.content)
        res.sendStatus(204)
    }
    async deleteComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (req.user?.id!==comment?.userId) {
            res.sendStatus(403)
            return
        }
        await this.commentsService.deleteCommentById(req.params.commentId)
        res.sendStatus(204)
    }
}




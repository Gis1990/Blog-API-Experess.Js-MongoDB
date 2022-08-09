import {Request, Response} from "express";
import {CommentsService} from "../domain/comments-service";


export class CommentsController{
    constructor(protected commentsService: CommentsService) {}
    async getComment(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.commentId)
        if (req.user){
            comment!.likesInfo.myStatus=await this.commentsService.returnUsersLikeStatus(req.params.commentId, req.user!.id)
            res.status(200).json(comment)
        }
        else{
            comment!.likesInfo.myStatus="None"
            res.status(200).json(comment)
        }
    }
    async getAllCommentsForSpecificPost(req: Request, res: Response) {
        const comments = await this.commentsService.getAllCommentsForSpecificPost(req.query, req.params.postId)
        if (req.user){
            for (let i=0; i<comments.items.length; i++){
                comments.items[i].likesInfo.myStatus=await this.commentsService.returnUsersLikeStatus(comments.items[i].id, req.user!.id)
            }
            res.status(200).json(comments)
        }
        else{
            comments.items.forEach(elem=>elem.likesInfo.myStatus="None")
            res.status(200).json(comments)
        }
    }
    async createComment(req: Request, res: Response) {
        const newComment = await this.commentsService.createComment(req.body.content,req.params.postId, req.user!)
        const {_id,postId,usersLikesInfo,...newCommentRest}=newComment
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
    async likeOperation(req: Request, res: Response) {
        await this.commentsService.likeOperation(req.params.commentId,req.user!.id,req.body.likeStatus)
        res.sendStatus(204)
    }
}




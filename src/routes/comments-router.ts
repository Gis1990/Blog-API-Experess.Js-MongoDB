import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {authTokenMiddleware} from "../middlewares/authentication-middleware";
import {commentsIdValidation, commentsInputValidation} from "../middlewares/input - validation - middleware";

export const commentsRouter = Router ({})



commentsRouter.get('/:commentId',
    commentsIdValidation,
    async  (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.commentId)
    res.json(comment);
})

commentsRouter.delete('/:commentId',
    commentsIdValidation,
    authTokenMiddleware,
    async  (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.commentId)
    if (req.user?.accountData.id!==comment?.userId) {
        res.sendStatus(403)
        return
    }
    await commentsService.deleteCommentById(req.params.commentId)
    res.sendStatus(204)
})

commentsRouter.put('/:commentId',
    commentsIdValidation,
    authTokenMiddleware,
    commentsInputValidation,
    async  (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.commentId)
    if (req.user?.accountData.id!==comment?.userId) {
        res.sendStatus(403)
        return
    }
    await commentsService.updateCommentById(req.params.commentId, req.body.content)
    res.sendStatus(204)
})
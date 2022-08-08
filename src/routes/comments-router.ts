import { Router} from "express";
import {authAccessTokenMiddleware} from "../middlewares/authentication-middleware";
import {
    commentsIdValidation,
    commentsInputValidation,
    likesInputValidation
} from "../middlewares/input - validation - middleware";
import {commentsController} from "../composition-root";

export const commentsRouter = Router ({})



commentsRouter.get('/:commentId',
    commentsIdValidation,
    commentsController.getComment.bind(commentsController))


commentsRouter.delete('/:commentId',
    commentsIdValidation,
    authAccessTokenMiddleware,
    commentsController.deleteComment.bind(commentsController))


commentsRouter.put('/:commentId',
    commentsIdValidation,
    authAccessTokenMiddleware,
    commentsInputValidation,
    commentsController.updateComment.bind(commentsController))


commentsRouter.put('/:commentId/like-status',
    likesInputValidation,
    authAccessTokenMiddleware,
    commentsIdValidation,
    commentsController.likeOperation.bind(commentsController))

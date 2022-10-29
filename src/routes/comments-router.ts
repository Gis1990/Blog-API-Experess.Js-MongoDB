import { Router} from "express";
import {
    commentsIdValidation,
    commentsInputValidation,
    likesInputValidation
} from "../middlewares/input - validation - middleware";
import {authAccessTokenController, commentsController} from "../composition-root";

export const commentsRouter = Router ({})



commentsRouter.get('/:commentId',
    authAccessTokenController.authMiddlewareForUnauthorizedUser.bind(authAccessTokenController),
    commentsIdValidation,
    commentsController.getComment.bind(commentsController))


commentsRouter.delete('/:commentId',
    commentsIdValidation,
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    commentsController.deleteComment.bind(commentsController))


commentsRouter.put('/:commentId',
    commentsIdValidation,
    commentsInputValidation,
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    commentsController.updateComment.bind(commentsController))


// commentsRouter.put('/:commentId/like-status',
//     commentsIdValidation,
//     authAccessTokenController.authAccessToken.bind(authAccessTokenController),
//     likesInputValidation,
//     commentsController.likeOperation.bind(commentsController))

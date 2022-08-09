import {Router} from "express";
import {
    commentsInputValidation, likesInputValidation,
    postsIdValidation, postsWithExtendedDataInputValidation,

} from "../middlewares/input - validation - middleware";
import {
    authenticationMiddleware,
    authAccessTokenMiddleware,
    authMiddlewareForUnauthorizedUser
} from "../middlewares/authentication-middleware";
import {postsController} from "../composition-root";
import {commentsController} from "../composition-root";


export const postsRouter = Router ({})


postsRouter.get('/',
    authMiddlewareForUnauthorizedUser,
    postsController.getAllPosts.bind(postsController))


postsRouter.post('/',
    authenticationMiddleware,
    postsWithExtendedDataInputValidation,
    postsController.createPostWithExtendedData.bind(postsController))


postsRouter.get('/:postId/comments',
    authMiddlewareForUnauthorizedUser,
    postsIdValidation,
    commentsController.getAllCommentsForSpecificPost.bind(commentsController))



postsRouter.get('/:postId',
    authMiddlewareForUnauthorizedUser,
    postsIdValidation,
    postsController.getPost.bind(postsController))



postsRouter.post('/:postId/comments',
    authAccessTokenMiddleware,
    postsIdValidation,
    commentsInputValidation,
    commentsController.createComment.bind(commentsController))


postsRouter.put('/:postId',
    authenticationMiddleware,
    postsIdValidation,
    postsWithExtendedDataInputValidation,
    postsController.updatePost.bind(postsController))



postsRouter.delete('/:postId',
    authenticationMiddleware,
    postsIdValidation,
    postsController.deletePost.bind(postsController))


postsRouter.put('/:postId/like-status',
    authAccessTokenMiddleware,
    postsIdValidation,
    likesInputValidation,
    postsController.likeOperation.bind(postsController))




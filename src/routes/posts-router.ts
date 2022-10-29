import {Router} from "express";
import {
    commentsInputValidation, likesInputValidation,
    postsIdValidation, postsWithExtendedDataInputValidation,

} from "../middlewares/input - validation - middleware";
import {
    authenticationMiddleware,
} from "../middlewares/authentication-middleware";
import {authAccessTokenController, postsController} from "../composition-root";
import {commentsController} from "../composition-root";


export const postsRouter = Router ({})


postsRouter.get('/',
    authAccessTokenController.authMiddlewareForUnauthorizedUser.bind(authAccessTokenController),
    postsController.getAllPosts.bind(postsController))


postsRouter.post('/',
    authenticationMiddleware,
    postsWithExtendedDataInputValidation,
    postsController.createPostWithExtendedData.bind(postsController))


postsRouter.get('/:postId/comments',
    authAccessTokenController.authMiddlewareForUnauthorizedUser.bind(authAccessTokenController),
    postsIdValidation,
    commentsController.getAllCommentsForSpecificPost.bind(commentsController))



postsRouter.get('/:postId',
    authAccessTokenController.authMiddlewareForUnauthorizedUser.bind(authAccessTokenController),
    postsIdValidation,
    postsController.getPost.bind(postsController))



postsRouter.post('/:postId/comments',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    commentsInputValidation,
    postsIdValidation,
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


// postsRouter.put('/:postId/like-status',
//     authAccessTokenController.authAccessToken.bind(authAccessTokenController),
//     postsIdValidation,
//     likesInputValidation,
//     postsController.likeOperation.bind(postsController))




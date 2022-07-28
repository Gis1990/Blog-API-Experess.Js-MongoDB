import {Request, Response, Router} from "express";
import {
    commentsInputValidation,
    postsIdValidation,
    postsInputValidation,
} from "../middlewares/input - validation - middleware";
import {authenticationMiddleware, authAccessTokenMiddleware} from "../middlewares/authentication-middleware";
import {postsController} from "../composition-root";
import {commentsController} from "../composition-root";


export const postsRouter = Router ({})


postsRouter.get('/',postsController.getAllPosts.bind(postsController))


postsRouter.post('/',
    authenticationMiddleware,
    postsInputValidation,
    postsController.createPost.bind(postsController))


postsRouter.get('/:postId/comments',
    postsIdValidation,
    commentsController.getAllCommentsForSpecificPost.bind(commentsController))



postsRouter.get('/:postId',
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
    postsInputValidation,
    postsController.updatePost.bind(postsController))



postsRouter.delete('/:postId',
    authenticationMiddleware,
    postsIdValidation,
    postsController.deletePost.bind(postsController))


postsRouter.post('/:postId/like-status',
    authAccessTokenMiddleware,
    postsIdValidation,
    async (req: Request, res: Response) => {
    })



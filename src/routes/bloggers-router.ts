import { Router} from 'express'
import {
    bloggersInputValidation,
    bloggersIdValidation,
    postsInputValidation,
}
    from "../middlewares/input - validation - middleware";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {authAccessTokenController, bloggersController} from "../composition-root";
import {postsController} from "../composition-root";


export const bloggersRouter = Router ({})


bloggersRouter.get('/',bloggersController.getAllBloggers.bind(bloggersController))


bloggersRouter.get('/:bloggerId',
    bloggersIdValidation,
    bloggersController.getBlogger.bind(bloggersController))



bloggersRouter.get('/:bloggerId/posts',
    authAccessTokenController.authMiddlewareForUnauthorizedUser.bind(authAccessTokenController),
    bloggersIdValidation,
    postsController.getAllPostsForSpecificBlogger.bind(postsController))



bloggersRouter.post('/',
    authenticationMiddleware,
    bloggersInputValidation,
    bloggersController.createBlogger.bind(bloggersController))



bloggersRouter.post('/:bloggerId/posts',
    authenticationMiddleware,
    bloggersIdValidation,
    postsInputValidation,
    postsController.createPost.bind(postsController))



bloggersRouter.put('/:bloggerId',
    authenticationMiddleware,
    bloggersIdValidation,
    bloggersInputValidation,
    bloggersController.updateBlogger.bind(bloggersController))



bloggersRouter.delete('/:bloggerId',
    authenticationMiddleware,
    bloggersIdValidation,
    bloggersController.deleteBlogger.bind(bloggersController))


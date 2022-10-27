import { Router} from 'express'
import {
    blogsInputValidation,
    blogsIdValidation,
    postsInputValidation,
}
    from "../middlewares/input - validation - middleware";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {authAccessTokenController, blogsController} from "../composition-root";
import {postsController} from "../composition-root";


export const blogsRouter = Router ({})


blogsRouter.get('/',blogsController.getAllBlogs.bind(blogsController))


blogsRouter.get('/:blogId',
    blogsIdValidation,
    blogsController.getBlog.bind(blogsController))




blogsRouter.get('/:blogId/posts',
    blogsIdValidation,
    authAccessTokenController.authMiddlewareForUnauthorizedUser.bind(authAccessTokenController),
    postsController.getAllPostsForSpecificBlog.bind(postsController))



blogsRouter.post('/',
    authenticationMiddleware,
    blogsInputValidation,
    blogsController.createBlog.bind(blogsController))



blogsRouter.post('/:blogId/posts',
    authenticationMiddleware,
    blogsIdValidation,
    postsInputValidation,
    postsController.createPost.bind(postsController))



blogsRouter.put('/:blogId',
    authenticationMiddleware,
    blogsIdValidation,
    blogsInputValidation,
    blogsController.updateBlog.bind(blogsController))



blogsRouter.delete('/:blogId',
    authenticationMiddleware,
    blogsIdValidation,
    blogsController.deleteBlog.bind(blogsController))


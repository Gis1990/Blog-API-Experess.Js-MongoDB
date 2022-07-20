import {Request, Response, Router} from "express";
import {
    commentsInputValidation,
    postsIdValidation,
    postsInputValidation,
} from "../middlewares/input - validation - middleware";
import {authenticationMiddleware, authAccessTokenMiddleware} from "../middlewares/authentication-middleware";
import {postsService} from "../domain/posts-service";

import {commentsService} from "../domain/comments-service";


export const postsRouter = Router ({})


postsRouter.get('/', async (req: Request, res: Response) => {
    const allPosts = await postsService.getAllPosts(req.query)
    res.json(allPosts)
})

postsRouter.post('/',
    authenticationMiddleware,
    postsInputValidation,
    async (req: Request, res: Response) => {
        const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        const {_id,...newPostRest}=newPost
        res.status(201).json(newPostRest)
    })


postsRouter.get('/:postId/comments',
    postsIdValidation,
    async (req: Request, res: Response) => {
        const comments = await commentsService.getAllCommentsForSpecificPost(req.query, req.params.postId)
        res.status(200).json(comments)
    })




postsRouter.get('/:postId',
    postsIdValidation,
    async (req: Request, res: Response) => {
        const post = await postsService.getPostById(req.params.postId)
        res.json(post);
    })


postsRouter.post('/:postId/comments',
    authAccessTokenMiddleware,
    postsIdValidation,
    commentsInputValidation,
    async (req: Request, res: Response) => {
        const newComment = await commentsService.createComment(req.body.content,req.params.postId, req.user!)
        const {_id,postId,...newCommentRest}=newComment
        res.status(201).json(newCommentRest)
    })


postsRouter.put('/:postId',
    authenticationMiddleware,
    postsIdValidation,
    postsInputValidation,
    async (req: Request, res: Response) => {
        await postsService.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.bloggerId)
        res.sendStatus(204)

    })



postsRouter.delete('/:postId',
    authenticationMiddleware,
    postsIdValidation,
    async (req: Request, res: Response) => {
        await postsService.deletePost(req.params.postId)
        res.sendStatus(204)
    })



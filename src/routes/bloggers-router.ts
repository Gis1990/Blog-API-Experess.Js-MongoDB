import {Request, Response, Router} from 'express'
import {bloggersService} from "../domain/bloggers-service";
import {bloggersInputValidation, bloggersIdValidation, postsInputValidation}
    from "../middlewares/input - validation - middleware";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {postsService} from "../domain/posts-service";


export const bloggersRouter = Router ({})


bloggersRouter.get('/',async  (req: Request, res: Response) => {
    const allBloggers= await bloggersService.getAllBloggers(req.query)
    res.json(allBloggers)
})


bloggersRouter.get('/:bloggerId',
    bloggersIdValidation,
    async (req: Request, res: Response) => {
        const blogger =await bloggersService.getBloggerById(req.params.bloggerId)
        res.json(blogger)
})


bloggersRouter.get('/:bloggerId/posts',
    bloggersIdValidation,
    async (req: Request, res: Response) => {
        const posts =await postsService.getAllPostsForSpecificBlogger(req.query,req.params.bloggerId)
        res.json(posts)
    })



bloggersRouter.post('/',
    authenticationMiddleware,
    bloggersInputValidation,
    async (req: Request, res: Response) => {
        const newBlogger= await bloggersService.createBlogger(req.body.name,req.body.youtubeUrl)
        const {_id,...newBloggerRest}=newBlogger
        res.status(201).json(newBloggerRest)
})


bloggersRouter.post('/:bloggerId/posts',
    authenticationMiddleware,
    bloggersIdValidation,
    postsInputValidation,
    async (req: Request, res: Response) => {
        const newPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.bloggerId)
        const {_id,...newPostRest}=newPost
        res.status(201).json(newPostRest)
    })



bloggersRouter.put('/:bloggerId',
    authenticationMiddleware,
    bloggersIdValidation,
    bloggersInputValidation,
     async (req: Request, res: Response) => {
         await bloggersService.updateBlogger(req.params.bloggerId, req.body.name, req.body.youtubeUrl)
         res.sendStatus(204)
     })


bloggersRouter.delete('/:bloggerId',
    authenticationMiddleware,
    bloggersIdValidation,
    async (req: Request, res: Response) => {
        await bloggersService.deleteBlogger(req.params.bloggerId)
        res.sendStatus(204)
    })


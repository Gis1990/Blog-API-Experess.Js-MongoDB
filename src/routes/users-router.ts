import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {authService} from "../domain/auth-service";
import {usersIdValidation, usersInputValidation} from "../middlewares/input - validation - middleware";

export const usersRouter = Router ({})


usersRouter.get("/", async (req: Request, res: Response) => {
    const  allUsers=await usersService.getAllUsers(req.query)
    return res.json(allUsers)
})

usersRouter.post("/",
    authenticationMiddleware,
    usersInputValidation,
    async (req: Request, res: Response) => {
    const newUser=await authService.createUserWithoutConfirmationEmail(req.body.login,req.body.email,req.body.password)
    const{emailConfirmation,email,...newUserWithoutEmailData}=newUser
    res.status(201).json(newUserWithoutEmailData)
})

usersRouter.delete("/:userId",
    usersIdValidation,
    authenticationMiddleware,
    async (req: Request, res: Response) => {
    await usersService.deleteUser(req.params.userId)
    res.sendStatus(204)
})

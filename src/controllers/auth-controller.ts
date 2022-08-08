import {Request, Response} from "express";
import {AuthService} from "../domain/auth-service";
import {EmailController} from "./email-controller";
import {UsersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export class AuthController{
    constructor(protected  authService: AuthService,protected emailController:EmailController,protected usersService:UsersService) {}
    async registrationConfirmation(req: Request, res: Response) {
            const result = await this.authService.confirmEmail(req.body.code)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        }
    async registration(req: Request, res: Response) {
        const newUser=await this.authService.createUserWithConfirmationEmail(req.body.login,req.body.email,req.body.password)
        await this.emailController.sendEmail(req.body.email,newUser.emailConfirmation.confirmationCode)
        if (newUser) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    }
    async registrationEmailResending(req: Request, res: Response) {
        const user = await this.usersService.findByLoginOrEmail(req.body.email)
        if (user){
            await this.authService.updateConfirmationCode(user.id)
        }
        const updatedUser = await this.usersService.findByLoginOrEmail(req.body.email)
        if (updatedUser){
            await this.emailController.sendEmail(req.body.email,updatedUser.emailConfirmation.confirmationCode)
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    }
    async login(req: Request, res: Response) {
        const user = await this.authService.checkCredentials(req.body.login, req.body.password,req.ip)
        if ((user)&&user.emailConfirmation.isConfirmed) {
            const accessToken = await jwtService.createAccessJWT(user)
            const refreshToken = await jwtService.createRefreshJWT(user)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20  * 1000 // 20 seconds
            });
            res.status(200).json({accessToken})
        } else {
            res.sendStatus(401)
        }
    }
    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const user = await this.authService.checkRefreshTokenCredentials(refreshToken)
        if (user){
            await this.authService.addRefreshTokenIntoBlackList(user.id,refreshToken)
            const accessToken = await jwtService.createAccessJWT(user)
            const newRefreshToken = await jwtService.createRefreshJWT(user)
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 2000 * 1000 // 20 seconds
            });
            res.status(200).json({accessToken})
        } else {
            res.sendStatus(401)
        }
    }
    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const user = await this.authService.checkRefreshTokenCredentials(refreshToken)
        if (user){
            await this.authService.addRefreshTokenIntoBlackList(user.id,refreshToken)
            const newRefreshToken = await jwtService.createRefreshJWT(user)
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 2000  * 1000 // 20 seconds
            });
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
    async me(req: Request, res: Response) {
        if (req.user?.id){
            const user={
                userId:req.user.id,
                login:req.user.login,
                email:req.user.email,
            }
            res.status(200).json(user)
        } else {
            res.sendStatus(401)
        }
    }
}
import {Request, Response, Router} from 'express'
import {authService} from "../domain/auth-service";
import {jwtService} from '../application/jwt-service'
import {
    confirmationCodesValidation,
    emailsInputValidation,
    loginsInputValidation,
    usersInputValidation
} from "../middlewares/input - validation - middleware";
import {emailController} from "../controllers/email-controller";
import {usersService} from "../domain/users-service";
import {
    rateLimiterForEmailResending,
    rateLimiterForLogin,
    rateLimiterForRegistration, rateLimiterForRegistrationConfirmation
} from "../controllers/rate-limit-controller";
export const authRouter = Router({})


authRouter.post('/registration-confirmation',
    confirmationCodesValidation,
    rateLimiterForRegistrationConfirmation,
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })



authRouter.post('/registration',
    usersInputValidation,
    rateLimiterForRegistration,
    async (req: Request, res: Response) => {
        const newUser=await authService.createUserWithConfirmationEmail(req.body.login,req.body.email,req.body.password)
        await emailController.sendEmail(req.body.email,newUser.emailConfirmation.confirmationCode)
        if (newUser) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    })

authRouter.post('/registration-email-resending',
    emailsInputValidation,
    rateLimiterForEmailResending,
    async (req: Request, res: Response) => {
        const user = await usersService.findByLoginOrEmail(req.body.email)
        if (user){
            await authService.updateConfirmationCode(user.accountData.id)
        }
        const updatedUser = await usersService.findByLoginOrEmail(req.body.email)
        if (updatedUser){
            await emailController.sendEmail(req.body.email,updatedUser.emailConfirmation.confirmationCode)
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    })



authRouter.post('/login',
    loginsInputValidation,
    rateLimiterForLogin,
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password,req.ip)
        if ((user)&&user.emailConfirmation.isConfirmed) {
            const accessToken = await jwtService.createJWT(user)
            res.status(200).json({accessToken})
        } else {
            res.sendStatus(401)
        }
    })




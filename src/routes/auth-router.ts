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
    })

authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const user = await authService.checkRefreshTokenCredentials(refreshToken)
        if (user){
            await authService.addRefreshTokenIntoBlackList(user.accountData.id,refreshToken)
            const accessToken = await jwtService.createAccessJWT(user)
            const newRefreshToken = await jwtService.createRefreshJWT(user)
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20  * 1000 // 20 seconds
            });
            res.status(200).json({accessToken})
        } else {
            res.sendStatus(401)
        }
    })




authRouter.post('/logout',
    async (req: Request, res: Response) => {
    })


authRouter.get('/me',
    async (req: Request, res: Response) => {
    })




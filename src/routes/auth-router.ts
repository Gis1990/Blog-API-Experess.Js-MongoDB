import { Router} from 'express'
import {authAccessTokenController, authController} from '../composition-root'
import {
    confirmationCodesValidation,
    emailsInputValidation,
    loginsInputValidation,
    usersInputValidation
} from "../middlewares/input - validation - middleware";
import {
    rateLimiterForEmailResending,
    rateLimiterForLogin,
    rateLimiterForRegistration, rateLimiterForRegistrationConfirmation
} from "../controllers/rate-limit-controller";



export const authRouter = Router({})




authRouter.post('/registration-confirmation',
    confirmationCodesValidation,
    rateLimiterForRegistrationConfirmation,
    authController.registrationConfirmation.bind(authController))



authRouter.post('/registration',
    usersInputValidation,
    rateLimiterForRegistration,
    authController.registration.bind(authController))


authRouter.post('/registration-email-resending',
    emailsInputValidation,
    rateLimiterForEmailResending,
    authController.registrationEmailResending.bind(authController))




authRouter.post('/login',
    loginsInputValidation,
    rateLimiterForLogin,
    authController.login.bind(authController))


authRouter.post('/refresh-token',authController.refreshAllTokens.bind(authController))



authRouter.post('/logout',authController.logout.bind(authController))



authRouter.get('/me',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    authController.me.bind(authController))




import { Router} from 'express'
import {authAccessTokenController, authController} from '../composition-root'
import {
    confirmationCodesValidation,
    emailsInputValidation,
    loginsInputValidation,
    newPasswordEndpointInputValidation,
    passwordRecoveryEndpointInputValidation,
    usersInputValidation
} from "../middlewares/input - validation - middleware";
import {
    rateLimiterForEmailResending,
    rateLimiterForLogin, rateLimiterForNewPassword, rateLimiterForPasswordRecovery,
    rateLimiterForRegistration, rateLimiterForRegistrationConfirmation
} from "../middlewares/rate-limit-middleware";



export const authRouter = Router({})


authRouter.post('/login',
    loginsInputValidation,
    rateLimiterForLogin,
    authController.login.bind(authController))


authRouter.post('/password-recovery',
    rateLimiterForPasswordRecovery,
    passwordRecoveryEndpointInputValidation,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    rateLimiterForNewPassword,
    newPasswordEndpointInputValidation,
    authController.newPassword.bind(authController))




authRouter.post('/refresh-token',authController.refreshAllTokens.bind(authController))


authRouter.post('/registration-confirmation',
    rateLimiterForRegistrationConfirmation,
    confirmationCodesValidation,
    authController.registrationConfirmation.bind(authController))



authRouter.post('/registration',
    usersInputValidation,
    rateLimiterForRegistration,
    authController.registration.bind(authController))


authRouter.post('/registration-email-resending',
    emailsInputValidation,
    rateLimiterForEmailResending,
    authController.registrationEmailResending.bind(authController))



authRouter.post('/logout',authController.logout.bind(authController))



authRouter.get('/me',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    authController.me.bind(authController))




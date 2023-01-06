import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {ConfirmEmailUseCase} from "../domain/use-cases/auth/confirm-email-use-case";
import {PasswordRecoveryUseCase} from "../domain/use-cases/auth/password-recovery-use-case";
import {AcceptNewPasswordUseCase} from "../domain/use-cases/auth/accept-new-password-use-case";
import {
    CreateUserWithConfirmationEmailUseCase
} from "../domain/use-cases/auth/create-user-with-confirmation-email-use-case";
import {RegistrationEmailResendingUseCase} from "../domain/use-cases/auth/registration-email-resending-use-case";
import {CheckCredentialsUseCase} from "../domain/use-cases/auth/check-credentials-use-case";
import {RefreshAllTokensUseCase} from "../domain/use-cases/auth/refresh-all-tokens-use-case";
import {RefreshOnlyRefreshTokenUseCase} from "../domain/use-cases/auth/refresh-only-refresh-token-use-case";


@injectable()
export class AuthController{
    constructor(@inject(ConfirmEmailUseCase) private  confirmEmailUseCase: ConfirmEmailUseCase,
                @inject(PasswordRecoveryUseCase) private  passwordRecoveryUseCase: PasswordRecoveryUseCase,
                @inject(AcceptNewPasswordUseCase) private  acceptNewPasswordUseCase: AcceptNewPasswordUseCase,
                @inject(CreateUserWithConfirmationEmailUseCase) private createUserWithConfirmationEmailUseCase: CreateUserWithConfirmationEmailUseCase,
                @inject(RegistrationEmailResendingUseCase) private  registrationEmailResendingUseCase: RegistrationEmailResendingUseCase,
                @inject(CheckCredentialsUseCase) private  checkCredentialsUseCase: CheckCredentialsUseCase,
                @inject(RefreshAllTokensUseCase) private  refreshAllTokensUseCase: RefreshAllTokensUseCase,
                @inject(RefreshOnlyRefreshTokenUseCase) private  refreshOnlyRefreshTokenUseCase: RefreshOnlyRefreshTokenUseCase
                ) {}
    async registrationConfirmation(req: Request, res: Response) {
            const result = await this.confirmEmailUseCase.execute(req.body.code)
            if (result) {
                res.sendStatus(204)
            } else {
                res.sendStatus(400)
            }
        }
    async passwordRecovery(req: Request, res: Response) {
        const result = await this.passwordRecoveryUseCase.execute(req.body.email)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
    async newPassword(req: Request, res: Response) {
        const result = await this.acceptNewPasswordUseCase.execute(req.body.newPassword, req.body.recoveryCode)
        if (result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    }
    async registration(req: Request, res: Response) {
        const newUser=await this.createUserWithConfirmationEmailUseCase.execute(req.body.login,req.body.email,req.body.password)
        if (newUser) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    }
    async registrationEmailResending(req: Request, res: Response) {
        const everythingIsCorrect = await this.registrationEmailResendingUseCase.execute(req.body.email)
        if (everythingIsCorrect){
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    }
    async login(req: Request, res: Response) {
        const result = await this.checkCredentialsUseCase.execute(req.body.loginOrEmail, req.body.password,req.ip,req.headers['user-agent'])
        if (result) {
            const accessToken = result[0]
            const refreshToken = result[1]
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20  * 100000 // 20 seconds
            });
            res.status(200).json({accessToken})
        } else {
            res.sendStatus(401)
        }
    }
    async refreshAllTokens(req: Request, res: Response) {
        const result = await this.refreshAllTokensUseCase.execute(req.cookies.refreshToken)
        if (result){
            const accessToken = result[0]
            const newRefreshToken = result[1]
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20 * 100000 // 20 seconds
            });
            res.status(200).json({accessToken})
        } else {
            res.sendStatus(401)
        }
    }
    async logout(req: Request, res: Response) {
        const newRefreshToken = await this.refreshOnlyRefreshTokenUseCase.execute(req.cookies.refreshToken)
        if (newRefreshToken){
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 20  * 1000 // 20 seconds
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
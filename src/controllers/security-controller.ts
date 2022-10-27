import {Request, Response} from "express";
import {AuthService} from "../domain/auth-service";



export class SecurityController{
    constructor(protected  authService: AuthService) {}
    async devices(req: Request, res: Response) {
        const newRefreshToken = await this.authService.refreshOnlyRefreshToken(req.cookies.refreshToken)
        if (newRefreshToken){
            res.status(200).json({device: "device"})
        } else {
            res.sendStatus(401)
        }
}}
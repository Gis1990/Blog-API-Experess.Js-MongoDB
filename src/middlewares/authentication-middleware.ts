import {NextFunction, Request, Response} from "express";
import {header, validationResult} from "express-validator";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {inject, injectable} from "inversify";



export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    await header("authorization").exists().trim().equals("Basic YWRtaW46cXdlcnR5").run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.sendStatus(401)
    } else {
        next()
    }
}



@injectable()
export class  AuthAccessTokenController {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(JwtService) private jwtService: JwtService) {
    }
    async authAccessToken(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            return
        }
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtService.getUserIdByAccessToken(token)
        let userData
        if (userId) {
            userData = await this.usersQueryRepository.findUserById(userId)
        } else {
            res.sendStatus(401)
            return
        }
        if (userData) {
            req.user = userData
            next()
        } else {
            res.sendStatus(401)
            return
        }
    }
    async authMiddlewareForUnauthorizedUser(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            next()
        } else {
            const token = req.headers.authorization.split(' ')[1]
            const userId = await this.jwtService.getUserIdByAccessToken(token)
            let userData
            if (userId) {
                userData = await this.usersQueryRepository.findUserById(userId)
                if (userData) {
                    req.user = userData
                    next()
                }
            }
        }
    }
}







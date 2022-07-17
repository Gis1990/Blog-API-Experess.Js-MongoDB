import {NextFunction, Request, Response} from "express";
import {header, validationResult} from "express-validator";
import {usersService} from '../domain/users-service'
import {jwtService} from '../application/jwt-service'


export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    await header("authorization").exists().trim().equals("Basic YWRtaW46cXdlcnR5").run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.sendStatus(401)
    } else {
        next()
    }
}

export const authTokenMiddleware = async (req: Request , res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    let userData
    if (userId) {
         userData = await usersService.findUserById(userId)
    }else{
        res.sendStatus(401)
        return
    }
    if (userData) {
        req.user=userData
        next()
    }else{
        res.sendStatus(401)
        return
    }
}






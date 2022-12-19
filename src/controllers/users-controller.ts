import {Request,Response} from "express";
import {UsersService} from "../domain/users-service";
import {AuthService} from "../domain/auth-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {inject, injectable} from "inversify";





@injectable()
export class UsersController{
    constructor(@inject(UsersService) protected usersService:UsersService,
                @inject(AuthService) protected authService:AuthService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {}
    async getAllUsers(req:Request,res:Response){
        const allUsers=await this.usersQueryRepository.getAllUsers(req.query)
        res.json(allUsers)
    }
    async deleteUser(req:Request,res:Response){
        await this.usersService.deleteUser(req.params.userId)
        res.sendStatus(204)
    }
    async createUser(req:Request,res:Response){
        const newUser=await this.authService.createUserWithoutConfirmationEmail(req.body.login,req.body.email,req.body.password)
        res.status(201).json(newUser)
    }
}






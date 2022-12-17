import {Request,Response} from "express";
import {UsersService} from "../domain/users-service";
import {AuthService} from "../domain/auth-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";





export class UsersController{
    constructor(protected usersService:UsersService,
                protected authService:AuthService,
                protected usersQueryRepository: UsersQueryRepository) {}
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






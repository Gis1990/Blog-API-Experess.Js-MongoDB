import {Request,Response} from "express";
import {AuthService} from "../domain/auth-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {inject, injectable} from "inversify";
import {DeleteUserUseCase} from "../domain/use-cases/users/delete-user-use-case";
import {
    CreateUserWithoutConfirmationEmailUseCase
} from "../domain/use-cases/auth/create-user-without-confirmation-email-use-case";





@injectable()
export class UsersController{
    constructor(
                @inject(AuthService) private authService:AuthService,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(DeleteUserUseCase) private deleteUserUseCase: DeleteUserUseCase,
                @inject(CreateUserWithoutConfirmationEmailUseCase) private createUserWithoutConfirmationEmailUseCase: CreateUserWithoutConfirmationEmailUseCase) {}
    async getAllUsers(req:Request,res:Response){
        const allUsers=await this.usersQueryRepository.getAllUsers(req.query)
        res.json(allUsers)
    }
    async deleteUser(req:Request,res:Response){
        await this.deleteUserUseCase.execute(req.params.userId)
        res.sendStatus(204)
    }
    async createUser(req:Request,res:Response){
        const newUser=await this.createUserWithoutConfirmationEmailUseCase.execute(req.body.login,req.body.email,req.body.password)
        res.status(201).json(newUser)
    }
}






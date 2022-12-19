import {UsersRepository} from "../repositories/users-repository";
import {inject, injectable} from "inversify";

@injectable()
export class  UsersService  {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository) {}
    async deleteUser(userId: string): Promise<boolean>  {
        return this.usersRepository.deleteUserById(userId)
    }
    async updateConfirmationCode(id: string): Promise<boolean> {
        return  this.usersRepository.updateConfirmationCode(id)
    }
}



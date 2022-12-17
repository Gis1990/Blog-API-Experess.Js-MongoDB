import {UsersRepository} from "../repositories/users-repository";


export class  UsersService  {
    constructor(protected usersRepository: UsersRepository) {}
    async deleteUser(userId: string): Promise<boolean>  {
        return this.usersRepository.deleteUserById(userId)
    }
    async updateConfirmationCode(id: string): Promise<boolean> {
        return  this.usersRepository.updateConfirmationCode(id)
    }
}



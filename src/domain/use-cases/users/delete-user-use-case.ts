import {inject, injectable} from "inversify";
import {UsersRepository} from "../../../repositories/users-repository";


@injectable()
export class DeleteUserUseCase {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async execute(userId: string): Promise<boolean>  {
        return this.usersRepository.deleteUserById(userId)
    }
}

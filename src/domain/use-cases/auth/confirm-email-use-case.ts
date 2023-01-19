import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../../../repositories/query-repositories/users-query-repository";
import {UsersRepository} from "../../../repositories/users-repository";


@injectable()
export class ConfirmEmailUseCase {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository) {}

    async execute(code: string):Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate <new Date()) return false;
        return await this.usersRepository.updateConfirmation(user.id)
    }
}

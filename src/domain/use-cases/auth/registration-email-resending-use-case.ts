import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../../../repositories/query-repositories/users-query-repository";
import {UsersRepository} from "../../../repositories/users-repository";
import {EmailAdapter} from "../../email-adapter";

@injectable()
export class RegistrationEmailResendingUseCase {
    constructor(
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        private emailAdapter: EmailAdapter,
    ) {}

    async execute (email: string): Promise<boolean> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(email)
        if (user){
            await this.usersRepository.updateConfirmationCode(user.id)
        }else{
            return false
        }
        const updatedUser = await this.usersQueryRepository.findByLoginOrEmail(email)
        if (updatedUser){
            await this.emailAdapter.sendEmailWithRegistration(email,updatedUser.emailConfirmation.confirmationCode)
            await this.usersRepository.addEmailLog(email)
            return true
        }else {
            return false
        }
    }
}

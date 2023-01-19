import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import {inject, injectable} from "inversify";
import {UserRecoveryCodeClass} from "../../../classes/classes";
import {UsersQueryRepository} from "../../../repositories/query-repositories/users-query-repository";
import {UsersRepository} from "../../../repositories/users-repository";
import {EmailAdapter} from "../../email-adapter";

@injectable()
export class PasswordRecoveryUseCase {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository,
                @inject(EmailAdapter) private emailAdapter:EmailAdapter) {}

    async execute (email: string): Promise<true> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(email)
        if (user){
            const passwordRecoveryData:UserRecoveryCodeClass=new UserRecoveryCodeClass(uuidv4(),add (new Date(),{hours:1}))
            await this.emailAdapter.sendEmailWithPasswordRecovery(email,passwordRecoveryData.recoveryCode)
            await this.usersRepository.addPasswordRecoveryCode(user.id,passwordRecoveryData)
            return true
        }else{
            return true
        }
    }
}

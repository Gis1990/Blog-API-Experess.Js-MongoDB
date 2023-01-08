import {UserAccountDBClass} from "../../../types/classes";
import {inject, injectable} from "inversify";
import {AuthService} from "../../auth-service";
import {UsersRepository} from "../../../repositories/users-repository";
import {EmailAdapter} from "../../../application/email-adapter";

@injectable()
export class CreateUserWithConfirmationEmailUseCase {
    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(EmailAdapter) private emailAdapter:EmailAdapter,
    ) {}

    async execute(login: string,email:string, password: string): Promise<UserAccountDBClass> {
        const newUser = await this.authService.createUser(login,email,password,false)
        await this.emailAdapter.sendEmailWithRegistration(email,newUser.emailConfirmation.confirmationCode)
        await this.usersRepository.addEmailLog(email)
        return newUser
    }
}

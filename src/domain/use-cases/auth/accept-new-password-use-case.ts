import {inject, injectable} from "inversify";
import {AuthService} from "../../auth-service";
import {UsersQueryRepository} from "../../../repositories/query-repositories/users-query-repository";
import {UsersRepository} from "../../../repositories/users-repository";

@injectable()
export class AcceptNewPasswordUseCase {
    constructor(
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(AuthService) private authService: AuthService,
    ) {}

    async execute(newPassword:string,recoveryCode: string):Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByRecoveryCode(recoveryCode)
        if (!user) return false
        if (user.emailRecoveryCode.expirationDate <new Date()) return false;
        const passwordHash = await this.authService._generateHash(newPassword)
        return await this.usersRepository.updatePasswordHash(user.id,passwordHash)
    }
}

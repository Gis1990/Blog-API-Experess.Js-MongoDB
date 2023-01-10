import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../../../repositories/users-query-repository";
import {JwtService} from "../../jwt-service";
import {UsersRepository} from "../../../repositories/users-repository";


@injectable()
export class AuthCredentialsCheckUseCase {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository,
                @inject(JwtService) private jwtService:JwtService) {}

    async execute(refreshToken:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        return !!user;
    }
}

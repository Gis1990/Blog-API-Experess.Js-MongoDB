import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../../../repositories/users-query-repository";
import {JwtService} from "../../jwt-service";
import {UsersRepository} from "../../../repositories/users-repository";


@injectable()
export class TerminateSpecificDeviceUseCase {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository,
                @inject(JwtService) private jwtService:JwtService) {}

    async execute(refreshToken:string,deviceId:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        if (user) {
            return await this.usersRepository.terminateSpecificDevice(userId,deviceId)
        } else {
            return false
        }
    }
}

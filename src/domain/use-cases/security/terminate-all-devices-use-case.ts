import {inject, injectable} from "inversify";
import {JwtService} from "../../../application/jwt-service";
import {UsersQueryRepository} from "../../../repositories/users-query-repository";
import {UsersRepository} from "../../../repositories/users-repository";

@injectable()
export class TerminateAllDevicesUseCase {
    constructor(@inject(JwtService) private jwtService:JwtService,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository) {}

    async execute(refreshToken:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        const usersData = await this.jwtService.getUserDevicesDataFromRefreshToken(refreshToken)
        if ((user)&&(usersData)) {
            return await this.usersRepository.terminateAllDevices(userId,usersData)
        } else {
            return false
        }
    }
}

import {UserDevicesDataClass} from "../../../types/classes";
import {inject, injectable} from "inversify";
import {JwtService} from "../../../application/jwt-service";
import {UsersQueryRepository} from "../../../repositories/users-query-repository";

@injectable()
export class ReturnAllDevicesUseCase {
    constructor(@inject(JwtService) private jwtService:JwtService,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository) {}

    async execute(refreshToken:string): Promise<UserDevicesDataClass[]|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        if (user) {
            return user.userDevicesData
        } else {
            return null
        }
    }
}

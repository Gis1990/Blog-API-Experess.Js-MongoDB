import {inject, injectable} from "inversify";
import {UsersQueryRepository} from "../../../repositories/users-query-repository";
import {JwtService} from "../../jwt-service";


@injectable()
export class CheckAccessRightsUseCase {
    constructor(@inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(JwtService) private jwtService:JwtService) {}

    async execute(refreshToken:string, deviceId:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const userByDeviceId=await this.usersQueryRepository.findUserByDeviceId(deviceId)
        if (userByDeviceId) {
            return userId === userByDeviceId.id}
        else {
            return false
        }
    }
}

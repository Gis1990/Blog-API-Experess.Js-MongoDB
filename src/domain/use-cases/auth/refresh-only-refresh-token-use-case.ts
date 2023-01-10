import {inject, injectable} from "inversify";
import {UsersRepository} from "../../../repositories/users-repository";
import {JwtService} from "../../jwt-service";
import {AuthService} from "../../auth-service";


@injectable()
export class RefreshOnlyRefreshTokenUseCase {
    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(JwtService) private jwtService:JwtService,
        @inject(UsersRepository) private usersRepository: UsersRepository,
    ) {}

    async execute (oldRefreshToken:string): Promise<string|null> {
        const result= await this.authService.comparingDataFromTokens(oldRefreshToken)
        if (!result) {
            return null;
        }
        const user=result[0]
        const usersDataAboutDeviceFromToken=result[1]
        await this.usersRepository.terminateSpecificDevice(user.id, usersDataAboutDeviceFromToken.deviceId);
        return await this.jwtService.createRefreshJWT(user, usersDataAboutDeviceFromToken );
    }
}

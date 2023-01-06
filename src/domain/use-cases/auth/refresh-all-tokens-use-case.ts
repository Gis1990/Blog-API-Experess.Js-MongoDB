import {inject, injectable} from "inversify";
import {AuthService} from "../../auth-service";
import {JwtService} from "../../../application/jwt-service";
import {UsersRepository} from "../../../repositories/users-repository";

@injectable()
export class RefreshAllTokensUseCase {
    constructor(
        @inject(AuthService) private authService: AuthService,
        @inject(JwtService) private jwtService:JwtService,
        @inject(UsersRepository) private usersRepository: UsersRepository,
    ) {}

    async execute (oldRefreshToken:string): Promise<string[]|null> {
        const result= await this.authService.comparingDataFromTokens(oldRefreshToken)
        if (!result) {
            return null;
        }
        const user=result[0]
        const usersDataAboutDeviceFromToken=result[1]
        const accessToken = await this.jwtService.createAccessJWT(user);
        const newLastActiveDate = new Date();
        await this.usersRepository.updateLastActiveDate( usersDataAboutDeviceFromToken, newLastActiveDate);
        const newRefreshToken = await this.jwtService.createRefreshJWT(user, usersDataAboutDeviceFromToken);
        return [accessToken, newRefreshToken];
    }
}

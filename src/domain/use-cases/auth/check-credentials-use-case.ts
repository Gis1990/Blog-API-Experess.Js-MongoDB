import {UserDevicesDataClass} from "../../../types/classes";
import {inject, injectable} from "inversify";
import {AuthService} from "../../auth-service";
import {UsersQueryRepository} from "../../../repositories/users-query-repository";
import {UsersRepository} from "../../../repositories/users-repository";
import {JwtService} from "../../../application/jwt-service";

@injectable()
export class CheckCredentialsUseCase {
    constructor(
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(AuthService) private authService: AuthService,
        @inject(JwtService) private jwtService:JwtService
    ) {}

    async execute(loginOrEmail: string, password: string,ip:string,title:string|undefined):Promise<string[]|null> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        await this.usersRepository.addLoginAttempt(user.id,ip)
        const isHashesEqual = await this.authService._isHashesEquals(password, user.passwordHash)
        if (isHashesEqual&&user.emailConfirmation.isConfirmed) {
            const userDevicesData: UserDevicesDataClass = new  UserDevicesDataClass(ip,new Date(),Number((new Date())).toString(),title)
            await this.usersRepository.addUserDevicesData(user.id,userDevicesData)
            const accessToken = await this.jwtService.createAccessJWT(user)
            const refreshToken = await this.jwtService.createRefreshJWT(user,userDevicesData)
            return [accessToken,refreshToken]
        } else {
            return null
        }
    }
}

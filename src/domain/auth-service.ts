import {ObjectId} from "mongodb";
import {
    UserAccountDBClass,
    UserRecoveryCodeClass
} from "../types/types";

import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserAccountEmailClass} from "../types/types";
import {UsersRepository} from "../repositories/users-repository";
import {EmailAdapter} from "../application/email-adapter";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {inject, injectable} from "inversify";


@injectable()
export class  AuthService  {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(EmailAdapter) private emailAdapter:EmailAdapter,
                @inject(JwtService) private jwtService:JwtService) {}
    async createUser(login: string,email:string, password: string,isConfirmed:boolean): Promise<UserAccountDBClass> {
        const passwordHash = await this._generateHash(password)
        const emailRecoveryCodeData:UserRecoveryCodeClass=new UserRecoveryCodeClass("",new Date())
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),isConfirmed)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(),emailRecoveryCodeData, [],emailConfirmation,[])
        const user=await this.usersRepository.createUser(newUser)
        await this.emailAdapter.sendEmailWithRegistration(email,newUser.emailConfirmation.confirmationCode)
        await this.usersRepository.addEmailLog(email)
        return user
    }
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    }
    async _isHashesEquals(password: string, hash2: string) {
        return await bcrypt.compare(password, hash2)
    }
    async comparingDataFromTokens (oldRefreshToken:string): Promise<[UserAccountDBClass, { ip: any; lastActiveDate: any; title: any; deviceId: any }]|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(oldRefreshToken);
        const user = await this.usersQueryRepository.findUserById(userId);
        const usersDataAboutDeviceFromToken = await this.jwtService.getUserDevicesDataFromRefreshToken(oldRefreshToken);
        const lastActiveDateFromDB = user?.userDevicesData.find((item)=>item.deviceId===usersDataAboutDeviceFromToken?.deviceId)?.lastActiveDate
        if (!user || !usersDataAboutDeviceFromToken||!lastActiveDateFromDB) {
            return null;
        }
        const stringDateFromJWT = usersDataAboutDeviceFromToken.lastActiveDate
        const lastActiveDateFromJWT = new Date(stringDateFromJWT);
        if (lastActiveDateFromJWT.getTime()!==lastActiveDateFromDB.getTime() ) {
            return null;
        }
        return [user, usersDataAboutDeviceFromToken];
    }

}



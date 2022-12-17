import {ObjectId} from "mongodb";
import {
    NewUserClassResponseModel,
    UserAccountDBClass,
    userDevicesDataClass,
    UserRecoveryCodeClass
} from "../types/types";

import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserAccountEmailClass} from "../types/types";
import {UsersRepository} from "../repositories/users-repository";
import {EmailAdapter} from "../application/email-adapter";
import {UsersService} from "./users-service";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";



export class  AuthService  {
    constructor(protected usersRepository: UsersRepository,
                protected usersQueryRepository: UsersQueryRepository,
                protected emailController:EmailAdapter,
                protected usersService:UsersService,
                protected jwtService:JwtService) {}
    async createUserWithConfirmationEmail(login: string,email:string, password: string): Promise<UserAccountDBClass> {
        const passwordHash = await this._generateHash(password)
        const emailRecoveryCodeData:UserRecoveryCodeClass=new UserRecoveryCodeClass("",new Date())
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),false)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(),emailRecoveryCodeData, [],emailConfirmation,[])
        const newUserWithConfirmationCode=this.usersRepository.createUser(newUser)
        await this.emailController.sendEmailWithRegistration(email,newUser.emailConfirmation.confirmationCode)
        await this.usersRepository.addEmailLog(email)
        return newUserWithConfirmationCode
    }
    async createUserWithoutConfirmationEmail(login: string,email:string, password: string): Promise<NewUserClassResponseModel> {
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),true)
        const emailRecoveryCodeData:UserRecoveryCodeClass=new UserRecoveryCodeClass("",new Date())
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(),emailRecoveryCodeData, [],emailConfirmation,[])
        const user=await this.usersRepository.createUser(newUser)
        return (({ id, login,email,createdAt }) => ({ id, login,email,createdAt }))(user)
    }
    async checkCredentials(loginOrEmail: string, password: string,ip:string,title:string|undefined):Promise<string[]|null> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        await this.usersRepository.addLoginAttempt(user.id,ip)
        const isHashesEqual = await this._isHashesEquals(password, user.passwordHash)
        if (isHashesEqual&&user.emailConfirmation.isConfirmed) {
            const userDevicesData: userDevicesDataClass = new  userDevicesDataClass(ip,new Date(),Number((new Date())).toString(),title)
            await this.usersRepository.addUserDevicesData(user.id,userDevicesData)
            const accessToken = await this.jwtService.createAccessJWT(user)
            const refreshToken = await this.jwtService.createRefreshJWT(user,userDevicesData)
            return [accessToken,refreshToken]
        } else {
            return null
        }
    }
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    }
    async _isHashesEquals(password: string, hash2: string) {
        return await bcrypt.compare(password, hash2)
    }
    async confirmEmail(code: string):Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate <new Date()) return false;
        return await this.usersRepository.updateConfirmation(user.id)
    }
    async passwordRecovery (email: string): Promise<true> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(email)
        if (user){
            const passwordRecoveryData:UserRecoveryCodeClass=new UserRecoveryCodeClass(uuidv4(),add (new Date(),{hours:1}))
            await this.emailController.sendEmailWithPasswordRecovery(email,passwordRecoveryData.recoveryCode)
            await this.usersRepository.addPasswordRecoveryCode(user.id,passwordRecoveryData)
            return true
        }else{
            return true
        }
    }
    async acceptNewPassword(newPassword:string,recoveryCode: string):Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByRecoveryCode(recoveryCode)
        if (!user) return false
        if (user.emailRecoveryCode.expirationDate <new Date()) return false;
        const passwordHash = await this._generateHash(newPassword)
        return await this.usersRepository.updatePasswordHash(user.id,passwordHash)
    }
    async registrationEmailResending (email: string): Promise<boolean> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(email)
        if (user){
            await this.usersService.updateConfirmationCode(user.id)
        }else{
            return false
        }
        const updatedUser = await this.usersQueryRepository.findByLoginOrEmail(email)
        if (updatedUser){
            await this.emailController.sendEmailWithRegistration(email,updatedUser.emailConfirmation.confirmationCode)
            await this.usersRepository.addEmailLog(email)
            return true
        }else {
            return false
        }
    }
    async refreshAllTokens (oldRefreshToken:string): Promise<string[]|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(oldRefreshToken);
        const user = await this.usersQueryRepository.findUserById(userId);
        const usersDataFromToken = await this.jwtService.getUserDevicesDataFromRefreshToken(oldRefreshToken);
        if (!user || !usersDataFromToken) {
            return null;
        }
        const accessToken = await this.jwtService.createAccessJWT(user);
        usersDataFromToken.lastActiveDate = new Date();
        const newLastActiveDate = usersDataFromToken.lastActiveDate;
        await this.usersRepository.updateLastActiveDate(userId, usersDataFromToken, newLastActiveDate);
        const newRefreshToken = await this.jwtService.createRefreshJWT(user, usersDataFromToken);
        return [accessToken, newRefreshToken];
    }
    async refreshOnlyRefreshToken (oldRefreshToken:string): Promise<string|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(oldRefreshToken);
        const user = await this.usersQueryRepository.findUserById(userId);
        const usersDataFromToken = await this.jwtService.getUserDevicesDataFromRefreshToken(oldRefreshToken);
        if (!user || !usersDataFromToken) {
            return null;
        }
        await this.usersRepository.terminateSpecificDevice(userId, usersDataFromToken.deviceId);
        return await this.jwtService.createRefreshJWT(user, usersDataFromToken);
    }
}



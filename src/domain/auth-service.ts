import {ObjectId} from "mongodb";
import {NewUserClassResponseModel, UserAccountDBClass, userDevicesDataClass} from "../types/types";

import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UserAccountEmailClass} from "../types/types";
import {UsersRepository} from "../repositories/users-repository";
import {EmailAdapter} from "../application/email-adapter";
import {UsersService} from "./users-service";
import {JwtService} from "../application/jwt-service";



export class  AuthService  {
    constructor(protected usersRepository: UsersRepository,
                protected emailController:EmailAdapter,
                protected usersService:UsersService,
                protected jwtService:JwtService) {}
    async createUserWithConfirmationEmail(login: string,email:string, password: string): Promise<UserAccountDBClass> {
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),false)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(), [],emailConfirmation,[])
        const newUserWithConfirmationCode=this.usersRepository.createUser(newUser)
        await this.emailController.sendEmail(email,newUser.emailConfirmation.confirmationCode)
        await this.usersRepository.addEmailLog(email)
        return newUserWithConfirmationCode
    }
    async createUserWithoutConfirmationEmail(login: string,email:string, password: string): Promise<NewUserClassResponseModel> {
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),true)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(), [],emailConfirmation,[])
        const user=await this.usersRepository.createUser(newUser)
        return (({ id, login,email,createdAt }) => ({ id, login,email,createdAt }))(user)
    }
    async checkCredentials(loginOrEmail: string, password: string,ip:string,title:string|undefined):Promise<string[]|null> {
        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        await this.usersRepository.addLoginAttempt(user.id,ip)
        const isHashesEqual = await this._isHashesEquals(password, user.passwordHash)
        if (isHashesEqual&&user.emailConfirmation.isConfirmed) {
            const accessToken = await this.jwtService.createAccessJWT(user)
            const session=await this.usersRepository.findUserDevicesSessions(user.id,ip)
            if ((session)&&(session.userDevicesData.length>0)){
                session.userDevicesData[0].lastActiveDate=new Date().toString()
                session.userDevicesData[0].title=title
                await this.usersRepository.updateSession(user.id,session.userDevicesData[0])
                const refreshToken = await this.jwtService.createRefreshJWT(user,session.userDevicesData[0])
                return [accessToken,refreshToken]
            }else{
                 const userDevicesData: userDevicesDataClass = new  userDevicesDataClass(ip,new Date().toString(),Number((new Date())).toString(),title)
                 await this.usersRepository.addUserDevicesData(user.id,userDevicesData)
                 const refreshToken = await this.jwtService.createRefreshJWT(user,userDevicesData)
                return [accessToken,refreshToken]
            }
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
        const user = await this.usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate <new Date()) return false;
        const result=await this.usersRepository.updateConfirmation(user.id)
        return result
    }
    async registrationEmailResending (email: string): Promise<boolean> {
        const user = await this.usersService.findByLoginOrEmail(email)
        if (user){
            await this.usersService.updateConfirmationCode(user.id)
        }else{
            return false
        }
        const updatedUser = await this.usersService.findByLoginOrEmail(email)
        if (updatedUser){
            await this.emailController.sendEmail(email,updatedUser.emailConfirmation.confirmationCode)
            await this.usersRepository.addEmailLog(email)
            return true
        }else {
            return false
        }
    }
    async refreshAllTokens (oldRefreshToken:string): Promise<string[]|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(oldRefreshToken)
        const user = await this.usersRepository.findUserById(userId)
        const usersDataFromToken = await this.jwtService.getUserDevicesDataFromRefreshToken(oldRefreshToken)
        if ((user)&&(usersDataFromToken)) {
            const accessToken = await this.jwtService.createAccessJWT(user)
            usersDataFromToken.lastActiveDate=new Date().toString()
            const newLastActiveDate=usersDataFromToken.lastActiveDate
            await this.usersRepository.updateLastActiveDate(userId,usersDataFromToken,newLastActiveDate)
            const newRefreshToken = await this.jwtService.createRefreshJWT(user,usersDataFromToken)
            return [accessToken,newRefreshToken]
        } else {
            return null
        }
    }
    async refreshOnlyRefreshToken (oldRefreshToken:string): Promise<string|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(oldRefreshToken)
        const user = await this.usersRepository.findUserById(userId)
        const usersDataFromToken = await this.jwtService.getUserDevicesDataFromRefreshToken(oldRefreshToken)
        if ((user)&&(usersDataFromToken)) {
            await this.usersRepository.terminateSpecificDevice(userId,usersDataFromToken.deviceId)
            return await this.jwtService.createRefreshJWT(user,usersDataFromToken)
        } else {
            return null
        }
    }
}



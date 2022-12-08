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
    async createUserWithConfirmationEmail(login: string,email:string, password: string,ip:string,title:string|undefined): Promise<UserAccountDBClass> {
        if(!title){
            title="Unknown device"
        }
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),false)
        const userDevicesData: userDevicesDataClass = new  userDevicesDataClass(ip,new Date().toString(),Number((new Date())).toString(),title)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(), [],emailConfirmation,[userDevicesData])
        const newUserWithConfirmationCode=this.usersRepository.createUser(newUser)
        await this.emailController.sendEmail(email,newUser.emailConfirmation.confirmationCode)
        await this.usersRepository.addEmailLog(email)
        return newUserWithConfirmationCode
    }
    async createUserWithoutConfirmationEmail(login: string,email:string, password: string,ip:string,title:string|undefined): Promise<NewUserClassResponseModel> {
        if(!title){
            title="Unknown device"
        }
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),true)
        const userDevicesData: userDevicesDataClass = new  userDevicesDataClass(ip,new Date().toString(),Number((new Date())).toString(),title)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(), [],emailConfirmation,[userDevicesData])
        const user=await this.usersRepository.createUser(newUser)
        return (({ id, login,email,createdAt }) => ({ id, login,email,createdAt }))(user)
    }
    async checkCredentials(login: string, password: string,ip:string):Promise<string[]|null> {
        const user = await this.usersRepository.findByLoginOrEmail(login)
        if (!user) return null
        await this.usersRepository.addLoginAttempt(user.id,ip)
        const isHashesEqual = await this._isHashesEquals(password, user.passwordHash)
        if (isHashesEqual&&user.emailConfirmation.isConfirmed) {
            const accessToken = await this.jwtService.createAccessJWT(user)
            const refreshToken = await this.jwtService.createRefreshJWT(user)
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
        const blackListedTokens=await this.usersRepository.findRefreshTokenInBlackList(userId,oldRefreshToken)
        if ((!blackListedTokens)&&(user)) {
            await this.usersService.addRefreshTokenIntoBlackList(user.id,oldRefreshToken)
            const accessToken = await this.jwtService.createAccessJWT(user)
            const newRefreshToken = await this.jwtService.createRefreshJWT(user)
            return [accessToken,newRefreshToken]
        } else {
            return null
        }
    }
    async refreshOnlyRefreshToken (oldRefreshToken:string): Promise<string|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(oldRefreshToken)
        const user = await this.usersRepository.findUserById(userId)
        const blackListedTokens=await this.usersRepository.findRefreshTokenInBlackList(userId,oldRefreshToken)
        if ((!blackListedTokens)&&(user)) {
            await this.usersService.addRefreshTokenIntoBlackList(user.id,oldRefreshToken)
            return await this.jwtService.createRefreshJWT(user)
        } else {
            return null
        }
    }
}



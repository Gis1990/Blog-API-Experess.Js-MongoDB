import {ObjectId} from "mongodb";
import {UserAccountDBClass} from "../repositories/types";

import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {jwtService} from "../application/jwt-service";
import {UserAccountEmailClass} from "../repositories/types";
import {UsersRepository} from "../repositories/users-repository";


export class  AuthService  {
    constructor(protected usersRepository: UsersRepository) {}
    async createUserWithConfirmationEmail(login: string,email:string, password: string): Promise<UserAccountDBClass> {
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),false)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(), [],emailConfirmation,[])
        return this.usersRepository.createUser(newUser)
    }
    async createUserWithoutConfirmationEmail(login: string,email:string, password: string): Promise<UserAccountDBClass> {
        const passwordHash = await this._generateHash(password)
        const emailConfirmation: UserAccountEmailClass = new  UserAccountEmailClass([],uuidv4(),add (new Date(),{hours:1}),true)
        const newUser: UserAccountDBClass = new UserAccountDBClass(new ObjectId(),Number((new Date())).toString(), login, email, passwordHash, new Date().toISOString(), [],emailConfirmation,[])
        return this.usersRepository.createUser(newUser)
    }
    async checkCredentials(login: string, password: string,ip:string) {
        const user = await this.usersRepository.findByLoginOrEmail(login)
        if (!user) return null
        await this.usersRepository.addLoginAttempt(user.id,ip)
        const isHashesEqual = await this._isHashesEquals(password, user.passwordHash)
        if (isHashesEqual) {
            return user
        } else {
            return null
        }
    }
    async checkRefreshTokenCredentials(token: string) {
        const userId = await jwtService.getUserIdByRefreshToken(token)
        const user = await this.usersRepository.findUserById(userId)
        const blackListedTokens=await this.usersRepository.findRefreshTokenInBlackList(userId,token)
        if (!blackListedTokens) {
            return user
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
    async updateConfirmationCode(id: string): Promise<boolean> {
        return  this.usersRepository.updateConfirmationCode(id)
    }
    async addRefreshTokenIntoBlackList(id: string,token:string): Promise<boolean> {
        return  this.usersRepository.addRefreshTokenIntoBlackList(id,token)
    }
}



import {ObjectId} from "mongodb";
import {getNewUserAccountType, UserAccountDBType} from "../repositories/types";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {jwtService} from "../application/jwt-service";






export const authService = {
    async createUserWithConfirmationEmail(login: string,email:string, password: string): Promise<getNewUserAccountType> {
        const passwordHash = await this._generateHash(password)
        const newUser: UserAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                id:Number((new Date())).toString(),
                login: login,
                email:email,
                passwordHash:passwordHash,
                refreshTokensBlackList: [],
                createdAt: new Date()
            },
            loginAttempts: [],
            emailConfirmation: {
                sentEmails: [],
                confirmationCode: uuidv4(),
                expirationDate: add (new Date(),{hours:1}),
                isConfirmed: false
            },
        }
        return usersRepository.createUser(newUser)
    },
    async createUserWithoutConfirmationEmail(login: string,email:string, password: string): Promise<getNewUserAccountType> {
        const passwordHash = await this._generateHash(password)
        const newUser: UserAccountDBType = {
            _id: new ObjectId(),
            accountData: {
                id:Number((new Date())).toString(),
                login: login,
                email:email,
                passwordHash:passwordHash,
                refreshTokensBlackList: [],
                createdAt: new Date()
            },
            loginAttempts: [],
            emailConfirmation: {
                sentEmails: [],
                confirmationCode: uuidv4(),
                expirationDate: add (new Date(),{hours:1}),
                isConfirmed: true
            },
        }
        return usersRepository.createUser(newUser)
    },
    async checkCredentials(login: string, password: string,ip:string) {
        const user = await usersRepository.findByLoginOrEmail(login)
        if (!user) return null
        await usersRepository.addLoginAttempt(user.accountData.id,ip)
        const isHashesEqual = await this._isHashesEquals(password, user.accountData.passwordHash)
        if (isHashesEqual) {
            return user
        } else {
            return null
        }
    },
    async checkRefreshTokenCredentials(token: string) {
        const userId = await jwtService.getUserIdByRefreshToken(token)
        const user = await usersRepository.findUserById(userId)
        const blackListedTokens=await usersRepository.findRefreshTokenInBlackList(userId,token)
        if (blackListedTokens) {
            return user
        } else {
            return null
        }

    },
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10)
    },
    async _isHashesEquals(password: string, hash2: string) {
        return await bcrypt.compare(password, hash2)
    },
    async confirmEmail(code: string):Promise<boolean> {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate <new Date()) return false;
        const result=await usersRepository.updateConfirmation(user.accountData.id)
        return result
    },
    async updateConfirmationCode(id: string): Promise<boolean> {
        return  usersRepository.updateConfirmationCode(id)
    },
    async addRefreshTokenIntoBlackList(id: string,token:string): Promise<boolean> {
        return  usersRepository.addRefreshTokenIntoBlackList(id,token)
    },
}
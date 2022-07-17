require('dotenv').config();
import {UserAccountDBType} from "../repositories/types";
import jwt from 'jsonwebtoken'
import {settings} from "../settings";



export const jwtService = {
    async createJWT(user: UserAccountDBType) {
        const token = jwt.sign({userId: user.accountData.id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return null
        }
    }
}


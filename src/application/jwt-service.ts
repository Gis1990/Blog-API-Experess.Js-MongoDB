import {settings} from "../settings";
import {UserAccountDBType} from "../repositories/types";
import jwt from 'jsonwebtoken'



export const jwtService = {
    async createJWT(user: UserAccountDBType) {
        const token = jwt.sign({userId: user.accountData.id}, settings.jwtSecret, {expiresIn: '1h'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.jwtSecret)
            return result.userId
        } catch (error) {
            return null
        }
    }
}


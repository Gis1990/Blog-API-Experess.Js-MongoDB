import {settings} from "../settings";
import {UserAccountDBType} from "../repositories/types";
import jwt from 'jsonwebtoken'



export const jwtService = {
    async createAccessJWT(user: UserAccountDBType) {
        const acessToken = jwt.sign({userId: user.accountData.id}, settings.jwtAccessTokenSecret, {expiresIn: '1h'})
        return acessToken
    },
    async createRefreshJWT(user: UserAccountDBType) {
        const refereshToken = jwt.sign({userId: user.accountData.id}, settings.jwtRefreshTokenSecret, {expiresIn: '1h'})
        return refereshToken
    },
    async getUserIdByAccessToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.jwtAccessTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    },
    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.jwtRefreshTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    }
}


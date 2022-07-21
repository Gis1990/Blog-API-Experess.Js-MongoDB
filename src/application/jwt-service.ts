import {settings} from "../settings";
import {UserAccountDBType} from "../repositories/types";
import jwt from 'jsonwebtoken'



export const jwtService = {
    async createAccessJWT(user: UserAccountDBType) {
        const accessToken = jwt.sign({userId: user.accountData.id}, settings.jwtAccessTokenSecret, {expiresIn: '10s'})
        return accessToken
    },
    async createRefreshJWT(user: UserAccountDBType) {
        const refreshToken = jwt.sign({userId: user.accountData.id}, settings.jwtRefreshTokenSecret, {expiresIn: '20s'})
        return refreshToken
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


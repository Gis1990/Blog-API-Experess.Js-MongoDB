import {settings} from "../settings";
import {UserAccountDBClass} from "../types/types";
import jwt from 'jsonwebtoken'



export class JwtService {
    async createAccessJWT(user: UserAccountDBClass) {
        const accessToken = jwt.sign({userId: user.id}, settings.jwtAccessTokenSecret, {expiresIn: '1h'})
        return accessToken
    }
    async createRefreshJWT(user: UserAccountDBClass) {
        const refreshToken = jwt.sign({userId: user.id}, settings.jwtRefreshTokenSecret, {expiresIn: '1h'})
        return refreshToken
    }
    async getUserIdByAccessToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.jwtAccessTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    }
    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.jwtRefreshTokenSecret)
            return result.userId
        } catch (error) {
            return null
        }
    }
}






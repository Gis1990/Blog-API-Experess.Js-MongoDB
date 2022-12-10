import {settings} from "../settings";
import {UserAccountDBClass, userDevicesDataClass} from "../types/types";
import jwt from 'jsonwebtoken'



export class JwtService {
    async createAccessJWT(user: UserAccountDBClass) {
        const accessToken = jwt.sign({userId: user.id}, settings.jwtAccessTokenSecret, {expiresIn: '10 seconds'})
        return accessToken
    }
    async createRefreshJWT(user: UserAccountDBClass,userDevicesData: userDevicesDataClass) {
        const refreshToken = jwt.sign({userId: user.id,ip:userDevicesData.ip,title:userDevicesData.title,lastActiveDate:userDevicesData.lastActiveDate,deviceId:userDevicesData.deviceId}, settings.jwtRefreshTokenSecret, {expiresIn: '1h'})
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
    async getUserDevicesDataFromRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.jwtRefreshTokenSecret)
            return {ip:result.ip,title:result.title,lastActiveDate:result.lastActiveDate,deviceId:result.deviceId}
        } catch (error) {
            return null
        }
    }
}






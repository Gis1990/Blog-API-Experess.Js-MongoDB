import {settings} from "../settings";
import {UserAccountDBClass, UserDevicesDataClass} from "../classes/classes";
import jwt from 'jsonwebtoken'
import {injectable} from "inversify";


@injectable()
export class JwtService {
    async createAccessJWT(user: UserAccountDBClass) {
        const accessToken = jwt.sign({userId: user.id}, settings.jwtAccessTokenSecret, {expiresIn: '15 minutes'})
        return accessToken
    }
    async createRefreshJWT(user: UserAccountDBClass,userDevicesData: UserDevicesDataClass) {
        const refreshToken = jwt.sign({userId: user.id,ip:userDevicesData.ip,title:userDevicesData.title,
            lastActiveDate:userDevicesData.lastActiveDate,deviceId:userDevicesData.deviceId},
            settings.jwtRefreshTokenSecret, {expiresIn: '1 hour'})
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






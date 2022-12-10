
import {userDevicesDataClass} from "../types/types";

import {UsersRepository} from "../repositories/users-repository";
import {JwtService} from "../application/jwt-service";



export class  SecurityService  {
    constructor(protected usersRepository: UsersRepository,
                protected jwtService:JwtService) {}
    async returnAllDevices(refreshToken:string): Promise<userDevicesDataClass[]|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersRepository.findUserById(userId)
        if (user) {
            return user.userDevicesData
        } else {
            return null
        }
    }
    async terminateAllDevices(refreshToken:string): Promise<true|false> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersRepository.findUserById(userId)
        const usersData = await this.jwtService.getUserDevicesDataFromRefreshToken(refreshToken)
        if ((user)&&(usersData)) {
            return await this.usersRepository.terminateAllDevices(userId,usersData)
        } else {
            return false
        }
    }
    async terminateSpecificDevice(refreshToken:string,deviceId:string): Promise<true|false> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersRepository.findUserById(userId)
        if (user) {
            return await this.usersRepository.terminateSpecificDevice(userId,deviceId)
        } else {
            return false
        }
    }
    async checkDeviceId(refreshToken:string,deviceId:string): Promise<true|false> {
        const usersData = await this.jwtService.getUserDevicesDataFromRefreshToken(refreshToken)
        if (usersData) {
            return usersData.deviceId === deviceId
        } else {
            return false
        }

    }

}



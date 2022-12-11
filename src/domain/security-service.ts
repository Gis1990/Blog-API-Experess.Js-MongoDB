
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
    async terminateSpecificDevice(refreshToken:string,deviceId:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersRepository.findUserById(userId)
        if (user) {
            return await this.usersRepository.terminateSpecificDevice(userId,deviceId)
        } else {
            return false
        }
    }
    async checkAccessRights(refreshToken:string, deviceId:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const userByDeviceId=await this.usersRepository.findUserByDeviceId(deviceId)
        if (userByDeviceId) {
        return userId === userByDeviceId.id}
        else {
            return false
        }
    }
    async authCredentialsCheck(refreshToken:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersRepository.findUserById(userId)
        return !!user;
    }

}



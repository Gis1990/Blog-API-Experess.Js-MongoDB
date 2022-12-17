import {userDevicesDataClass} from "../types/types";
import {UsersRepository} from "../repositories/users-repository";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/users-query-repository";



export class  SecurityService  {
    constructor(protected usersRepository: UsersRepository,
                protected jwtService:JwtService,
                protected usersQueryRepository: UsersQueryRepository) {}
    async returnAllDevices(refreshToken:string): Promise<userDevicesDataClass[]|null> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        if (user) {
            return user.userDevicesData
        } else {
            return null
        }
    }
    async terminateAllDevices(refreshToken:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        const usersData = await this.jwtService.getUserDevicesDataFromRefreshToken(refreshToken)
        if ((user)&&(usersData)) {
            return await this.usersRepository.terminateAllDevices(userId,usersData)
        } else {
            return false
        }
    }
    async terminateSpecificDevice(refreshToken:string,deviceId:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        if (user) {
            return await this.usersRepository.terminateSpecificDevice(userId,deviceId)
        } else {
            return false
        }
    }
    async checkAccessRights(refreshToken:string, deviceId:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const userByDeviceId=await this.usersQueryRepository.findUserByDeviceId(deviceId)
        if (userByDeviceId) {
        return userId === userByDeviceId.id}
        else {
            return false
        }
    }
    async authCredentialsCheck(refreshToken:string): Promise<boolean> {
        const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken)
        const user = await this.usersQueryRepository.findUserById(userId)
        return !!user;
    }

}



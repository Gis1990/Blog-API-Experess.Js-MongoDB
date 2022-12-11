import {Request, Response} from "express";
import {SecurityService} from "../domain/security-service";



export class SecurityController{
    constructor(protected  securityService: SecurityService) {}
    async devices(req: Request, res: Response) {
        const allDevices = await this.securityService.returnAllDevices(req.cookies.refreshToken)
        if (allDevices){
            res.status(200).json(allDevices)
        } else {
            res.sendStatus(401)
        }
    }
    async terminateAllDevices(req: Request, res: Response) {
        const devicesTerminated = await this.securityService.terminateAllDevices(req.cookies.refreshToken)
        if (devicesTerminated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
    async terminateSpecificDevice(req: Request, res: Response) {
        const correct1 = await this.securityService.checkAccessRights(req.cookies.refreshToken,req.params.deviceId)
        const correct2 = await this.securityService.checkDeviceId(req.cookies.refreshToken,req.params.deviceId)
        if ((!correct1)||(!correct2)) {
            res.sendStatus(403)
        }
        const deviceTerminated = await this.securityService.terminateSpecificDevice(req.cookies.refreshToken,req.params.deviceId)
        if (deviceTerminated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
}
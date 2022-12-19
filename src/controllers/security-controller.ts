import {Request, Response} from "express";
import {SecurityService} from "../domain/security-service";
import {inject, injectable} from "inversify";


@injectable()
export class SecurityController{
    constructor(@inject(SecurityService) protected  securityService: SecurityService) {}
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
        const exist = await this.securityService.authCredentialsCheck(req.cookies.refreshToken)
        if  (!exist) {
            res.sendStatus(401)
            return
        }
        const correct = await this.securityService.checkAccessRights(req.cookies.refreshToken,req.params.deviceId)
        if  (!correct) {
            res.sendStatus(403)
            return
        }
        const deviceTerminated = await this.securityService.terminateSpecificDevice(req.cookies.refreshToken,req.params.deviceId)
        if (deviceTerminated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
}


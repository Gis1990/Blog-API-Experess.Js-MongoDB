import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {ReturnAllDevicesUseCase} from "../domain/use-cases/security/return-all-devices-use-case";
import {TerminateAllDevicesUseCase} from "../domain/use-cases/security/terminate-all-devices-use-case";
import {AuthCredentialsCheckUseCase} from "../domain/use-cases/security/auth-credentials-check-use-case";
import {CheckAccessRightsUseCase} from "../domain/use-cases/security/check-access-rights-use-case";
import {TerminateSpecificDeviceUseCase} from "../domain/use-cases/security/terminate-specific-device-use-case";


@injectable()
export class SecurityController{
    constructor(@inject(ReturnAllDevicesUseCase) private  returnAllDevicesUseCase: ReturnAllDevicesUseCase,
                @inject(TerminateAllDevicesUseCase) private  terminateAllDevicesUseCase: TerminateAllDevicesUseCase,
                @inject(AuthCredentialsCheckUseCase) private  authCredentialsCheckUseCase: AuthCredentialsCheckUseCase,
                @inject(CheckAccessRightsUseCase) private  checkAccessRightsUseCase: CheckAccessRightsUseCase,
                @inject(TerminateSpecificDeviceUseCase) private  terminateSpecificDeviceUseCase: TerminateSpecificDeviceUseCase) {}
    async devices(req: Request, res: Response) {
        const allDevices = await this.returnAllDevicesUseCase.execute(req.cookies.refreshToken)
        if (allDevices){
            res.status(200).json(allDevices)
        } else {
            res.sendStatus(401)
        }
    }
    async terminateAllDevices(req: Request, res: Response) {
        const devicesTerminated = await this.terminateAllDevicesUseCase.execute(req.cookies.refreshToken)
        if (devicesTerminated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
    async terminateSpecificDevice(req: Request, res: Response) {
        const exist = await this.authCredentialsCheckUseCase.execute(req.cookies.refreshToken)
        if  (!exist) {
            res.sendStatus(401)
            return
        }
        const correct = await this.checkAccessRightsUseCase.execute(req.cookies.refreshToken,req.params.deviceId)
        if  (!correct) {
            res.sendStatus(403)
            return
        }
        const deviceTerminated = await this.terminateSpecificDeviceUseCase.execute(req.cookies.refreshToken,req.params.deviceId)
        if (deviceTerminated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
}


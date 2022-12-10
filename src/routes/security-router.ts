import {Router} from 'express'
import {securityController} from "../composition-root";
import {deviceIdValidation} from "../middlewares/input - validation - middleware";




export const securityRouter = Router({})



securityRouter.get('/devices',
    securityController.devices.bind(securityController))

securityRouter.delete('/devices',
    securityController.terminateAllDevices.bind(securityController))

securityRouter.delete('/devices/:deviceId',
    deviceIdValidation,
    securityController.terminateSpecificDevice.bind(securityController))




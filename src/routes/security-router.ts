import {Router} from 'express'
import {securityController} from "../composition-root";




export const securityRouter = Router({})



securityRouter.get('/devices',
    securityController.devices.bind(securityController))




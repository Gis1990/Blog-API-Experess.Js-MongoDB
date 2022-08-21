import {Router} from "express";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {usersIdValidation, usersInputValidation} from "../middlewares/input - validation - middleware";
import {usersController} from "../composition-root";

export const usersRouter = Router ({})





usersRouter.get("/",usersController.getAllUsers.bind(usersController))


usersRouter.post("/",
    authenticationMiddleware,
    usersInputValidation,
    usersController.createUser.bind(usersController))


usersRouter.delete("/:userId",
    usersIdValidation,
    authenticationMiddleware,
    usersController.deleteUser.bind(usersController))

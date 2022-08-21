import {Router} from "express";
import {authAccessTokenController,  quizController} from "../composition-root";




export const quizRouter = Router({})




quizRouter.get('/pairs/my-current',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    quizController.myCurrent.bind(quizController)
)


quizRouter.get('/pairs/:id',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    quizController.returnGameById.bind(quizController)
)

quizRouter.get('/pairs/my',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    quizController.returnAllMyGames.bind(quizController)
)


quizRouter.post('/pairs/connection',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    quizController.connection.bind(quizController)
)



quizRouter.post('/pairs/my-current/answers',
    authAccessTokenController.authAccessToken.bind(authAccessTokenController),
    quizController.answers.bind(quizController)
)


quizRouter.post('/pairs/users/top',
    quizController.top.bind(quizController)
)
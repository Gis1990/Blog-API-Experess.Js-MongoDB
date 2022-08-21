import {Request, Response} from "express";
import {QuizService} from "../domain/pair-game-quiz-service";


export class QuizController  {
    constructor(protected quizService:QuizService) {}
    async myCurrent (req: Request, res: Response) {
        const currentGame=await this.quizService.returnGameByUserId(req.user!.id)
        if (currentGame) {
            res.status(200).json(currentGame)}
        else {
            res.sendStatus(404)
        }
    }
    async returnGameById (req: Request, res: Response) {
    }
    async returnAllMyGames (req: Request, res: Response) {
    }
    async connection (req: Request, res: Response) {
    }
    async answers (req: Request, res: Response) {
    }
    async top (req: Request, res: Response) {
    }
}
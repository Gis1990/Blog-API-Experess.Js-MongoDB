import { QuizGameDBClass} from "../repositories/types";
import {QuizRepository} from "../repositories/pair-game-quiz-repository";


export class QuizService  {
    constructor(protected quizRepository:QuizRepository) {}
    async returnGameByUserId(userId: string): Promise<QuizGameDBClass|null> {
        return this.quizRepository.returnGameByUserId(userId)
    }
}
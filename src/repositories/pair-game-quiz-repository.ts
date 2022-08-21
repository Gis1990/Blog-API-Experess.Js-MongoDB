import {QuizGameDBClass} from "./types";
import {QuizModelClass} from "./db";


export class  QuizRepository  {
    async returnGameByUserId(userId:string):Promise<QuizGameDBClass|null> {
        return QuizModelClass.findOne({ userId: userId }, { _id:0 } )
    }
}
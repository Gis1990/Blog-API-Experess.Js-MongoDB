import {CommentDBClass, CommentViewModelClass} from "../classes/classes";
import {CommentsModelClass} from "./db";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async createComment(comment: CommentDBClass): Promise<CommentViewModelClass> {
        await CommentsModelClass.insertMany([comment]);
        return comment.transformToCommentViewModelClass();
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await CommentsModelClass.updateOne({id: id}, {$set: {content}})
        return result.matchedCount === 1
    }

    async likeOperation(id: string, update:any): Promise<boolean> {

        const result = await CommentsModelClass.updateOne({ id: id }, update);
        return result.matchedCount === 1;
    }
}



import {CommentDBClass, CommentDBClassPagination} from "./types";
import {CommentsModelClass} from "./db";

export class CommentsRepository  {
    async getCommentById(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({ id: id }, { _id:0,postId:0  } )
    }
    async getAllCommentsForSpecificPost(PageNumber:number,PageSize:number,postId:string):Promise<CommentDBClassPagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor = await CommentsModelClass.find({postId: postId}, {
            _id: 0,
            postId: 0
        }).skip(skips).limit(PageSize).lean()
        const totalCount = await CommentsModelClass.count({postId: postId})
        return new CommentDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor)
    }
    async createComment(comment:CommentDBClass): Promise<CommentDBClass> {
        await CommentsModelClass.insertMany([comment]);
        return comment;
    }
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result=await CommentsModelClass.updateOne({id:id},{$set:{content}})
        return result.matchedCount===1
    }
}




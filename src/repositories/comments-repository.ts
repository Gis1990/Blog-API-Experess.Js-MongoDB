import {CommentDBType, CommentDBTypePagination} from "./types";
import {CommentsModelClass} from "./db";

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentDBType | null> {
        return CommentsModelClass.findOne({ id: id }, { _id:1,postId:0  } )
    },
    async getAllCommentsForSpecificPost(PageNumber:number,PageSize:number,postId:string):Promise<CommentDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor=await CommentsModelClass.find({postId:postId}, { _id:0,postId:0 } ).skip(skips).limit(PageSize).lean()
        const totalCount=await CommentsModelClass.count({postId:postId})
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async createComment(comment:CommentDBType): Promise<CommentDBType> {
        await CommentsModelClass.insertMany([comment]);
        return comment;
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result=await CommentsModelClass.updateOne({id:id},{$set:{content}})
        return result.matchedCount===1
    }
}

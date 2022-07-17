import {CommentDBType, CommentDBTypePagination} from "./types";
import {CommentsModel} from "./db";

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentDBType | null> {
        return CommentsModel.findOne({ id: id }, { projection: { _id:0,postId:0  } })
    },
    async getAllCommentsForSpecificPost(PageNumber:number,PageSize:number,postId:string):Promise<CommentDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor=await CommentsModel.find({postId:postId}, { projection: { _id:0,postId:0 } }).skip(skips).limit(PageSize).lean()
        const totalCount=await CommentsModel.count({postId:postId})
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async createComment(comment:CommentDBType): Promise<CommentDBType> {
        await CommentsModel.insertMany([comment]);
        return comment;
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModel.deleteOne({id: id});
        return result.deletedCount === 1
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result=await CommentsModel.updateOne({id:id},{$set:{content}})
        return result.matchedCount===1
    }
}

import {CommentDBType, CommentDBTypePagination,UserAccountDBType} from "../repositories/types";
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/comments-repository";


export const commentsService = {
    async getCommentById(id: string): Promise<CommentDBType | null> {
        return commentsRepository.getCommentById(id)
    },
    async getAllCommentsForSpecificPost(obj:{PageNumber?:number,PageSize?:number},postId:string): Promise<CommentDBTypePagination> {
        const {PageNumber=1,PageSize=10}=obj
        return commentsRepository.getAllCommentsForSpecificPost(Number(PageNumber),Number(PageSize),postId)
    },
    async createComment(content: string,postId:string, user:UserAccountDBType): Promise<CommentDBType> {
        const userId=user.accountData.id
        const userLogin=user.accountData.login
        const id=Number((new Date())).toString()
        const comment= {_id: new ObjectId(),id, content, userId, userLogin,postId, addedAt: new Date().toISOString()}
        return  commentsRepository.createComment(comment)
    },
    async deleteCommentById(id: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(id)
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        return commentsRepository.updateCommentById(id, content)
    }
}

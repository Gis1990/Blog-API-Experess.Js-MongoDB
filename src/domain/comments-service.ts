import {
    CommentDBClass,
    CommentDBClassPagination,
    LikesInfoClass, NewCommentClassResponseModel,
    UserAccountDBClass,
    UsersLikesInfoClass
} from "../types/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";




export class CommentsService  {
    constructor(protected commentsRepository: CommentsRepository) {}
    async getCommentById(id: string,userId: string | undefined): Promise<CommentDBClass | null> {
        const comment = await this.commentsRepository.getCommentById(id)
        if (!comment){
            return null
        }
        if (userId){
            comment!.likesInfo.myStatus=await this.commentsRepository.returnUsersLikeStatus(id,userId)
        }
        else{
            comment!.likesInfo.myStatus="None"}
        return comment
    }
    async getAllCommentsForSpecificPost(obj:{PageNumber?:number,PageSize?:number},postId:string,userId: string | undefined): Promise<CommentDBClassPagination> {
        const {PageNumber=1,PageSize=10}=obj
        const comments = await this.commentsRepository.getAllCommentsForSpecificPost(Number(PageNumber), Number(PageSize),postId)
        if (userId){
            for (let i=0; i<comments.items.length; i++){
                comments.items[i].likesInfo.myStatus=await this.commentsRepository.returnUsersLikeStatus(comments.items[i].id, userId)
            }
        }
        else{
            comments.items.forEach(elem=>elem.likesInfo.myStatus="None")}
        return comments
    }
    async createComment(content: string,postId:string, user:UserAccountDBClass): Promise<NewCommentClassResponseModel> {
        const likes: LikesInfoClass= new LikesInfoClass(0,0,"None")
        const usersLikesInfo: UsersLikesInfoClass= new UsersLikesInfoClass([],[])
        const comment:CommentDBClass = new CommentDBClass (new ObjectId(),Number((new Date())).toString() ,content,user.id,user.login,postId,new Date().toISOString(),likes,usersLikesInfo)
        const newComment= await this.commentsRepository.createComment(comment)
        return  (({ id, content, userId, userLogin, addedAt, likesInfo }) => ({id, content, userId, userLogin, addedAt, likesInfo}))(newComment)
    }
    async deleteCommentById(id: string,userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentById(id)
        if (!comment) {
            return false
        }
        if (userId!==comment.userId) {
            return false
        }
        return this.commentsRepository.deleteCommentById(id)
    }
    async updateCommentById(id: string, content: string,userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentById(id)
        if (!comment) {
            return false
        }
        if (userId!==comment.userId) {
            return false
        }
        return this.commentsRepository.updateCommentById(id, content)
    }
    async likeOperation(id: string,userId: string,likeStatus: string): Promise<boolean> {
        return  this.commentsRepository.likeOperation(id,userId,likeStatus)
    }
}




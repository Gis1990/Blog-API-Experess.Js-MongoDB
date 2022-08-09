import {
    CommentDBClass,
    CommentDBClassPagination,
    LikesInfoClass,
    UserAccountDBClass,
    UsersLikesInfoClass
} from "../repositories/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";

export class CommentsService  {
    constructor(protected commentsRepository: CommentsRepository) {}
    async getCommentById(id: string): Promise<CommentDBClass | null> {
        return this.commentsRepository.getCommentById(id)
    }
    async getAllCommentsForSpecificPost(obj:{PageNumber?:number,PageSize?:number},postId:string): Promise<CommentDBClassPagination> {
        const {PageNumber=1,PageSize=10}=obj
        return this.commentsRepository.getAllCommentsForSpecificPost(Number(PageNumber),Number(PageSize),postId)
    }
    async createComment(content: string,postId:string, user:UserAccountDBClass): Promise<CommentDBClass> {
        const likes: LikesInfoClass= new LikesInfoClass(0,0,"None")
        const usersLikesInfo: UsersLikesInfoClass= new UsersLikesInfoClass([],[])
        const comment:CommentDBClass = new CommentDBClass (new ObjectId(),Number((new Date())).toString() ,content,user.id,user.login,postId,new Date().toISOString(),likes,usersLikesInfo)
        return  this.commentsRepository.createComment(comment)
    }
    async deleteCommentById(id: string): Promise<boolean> {
        return this.commentsRepository.deleteCommentById(id)
    }
    async updateCommentById(id: string, content: string): Promise<boolean> {
        return this.commentsRepository.updateCommentById(id, content)
    }
    async likeOperation(id: string,userId: string,likeStatus: string): Promise<boolean> {
        return  this.commentsRepository.likeOperation(id,userId,likeStatus)
    }
    async returnUsersLikeStatus(id: string,userId: string): Promise<string> {
        return  this.commentsRepository.returnUsersLikeStatus(id,userId)
    }
}




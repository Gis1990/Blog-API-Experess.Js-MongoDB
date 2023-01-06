import {
    CommentDBClass,
    CommentDBClassPagination,
} from "../types/types";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {inject, injectable} from "inversify";



@injectable()
export class CommentsService  {
    constructor(@inject(CommentsRepository) private commentsRepository: CommentsRepository,
                @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository) {}
    async getCommentById(id: string,userId: string | undefined): Promise<CommentDBClass | null> {
        const comment = await this.commentsQueryRepository.getCommentById(id)
        if (!comment){
            return null
        }
        if (userId){
            comment!.likesInfo.myStatus=await this.commentsQueryRepository.returnUsersLikeStatus(id,userId)
        }
        else{
            comment!.likesInfo.myStatus="None"}
        return comment
    }
    async getAllCommentsForSpecificPost(obj:{pageNumber?:number,pageSize?:number,sortBy?:string,sortDirection?:string}, postId:string, userId: string | undefined): Promise<CommentDBClassPagination> {
        const {pageNumber=1,pageSize=10,sortBy="createdAt",sortDirection="desc"}=obj
        const comments = await this.commentsQueryRepository.getAllCommentsForSpecificPost(Number(pageNumber), Number(pageSize),sortBy,sortDirection,postId)
        if (userId){
            for (let i=0; i<comments.items.length; i++){
                comments.items[i].likesInfo.myStatus=await this.commentsQueryRepository.returnUsersLikeStatus(comments.items[i].id, userId)
            }
        }
        else{
            comments.items.forEach(elem=>elem.likesInfo.myStatus="None")}
        return comments
    }

}




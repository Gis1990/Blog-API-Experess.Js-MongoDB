import {
    CommentDBClass,
    CommentDBClassPagination,
    LikesInfoClass, NewCommentClassResponseModel,
    UserAccountDBClass,
    UsersLikesInfoClass
} from "../types/types";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";




export class CommentsService  {
    constructor(protected commentsRepository: CommentsRepository,
                protected commentsQueryRepository: CommentsQueryRepository) {}
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
    async createComment(content: string,postId:string, user:UserAccountDBClass): Promise<NewCommentClassResponseModel> {
        const likes: LikesInfoClass= new LikesInfoClass(0,0,"None")
        const usersLikesInfo: UsersLikesInfoClass= new UsersLikesInfoClass([],[])
        const comment:CommentDBClass = new CommentDBClass (new ObjectId(),Number((new Date())).toString() ,content,user.id,user.login,postId,new Date().toISOString(),likes,usersLikesInfo)
        const newComment= await this.commentsRepository.createComment(comment)
        return  (({ id, content, userId, userLogin, createdAt, likesInfo }) => ({id, content, userId, userLogin, createdAt, likesInfo}))(newComment)
    }
    async deleteCommentById(id: string,userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsQueryRepository.getCommentById(id)
        if (!comment) {
            return false
        }
        if (userId!==comment.userId) {
            return false
        }
        return this.commentsRepository.deleteCommentById(id)
    }
    async updateCommentById(id: string, content: string,userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsQueryRepository.getCommentById(id)
        if (!comment) {
            return false
        }
        if (userId!==comment.userId) {
            return false
        }
        return this.commentsRepository.updateCommentById(id, content)
    }
    async likeOperation(id: string,userId: string,likeStatus: string): Promise<boolean> {
        // Find the comment with the given id
        const comment = await this.commentsQueryRepository.getCommentByIdForLikeOperation(id)
        if (!comment) {
            // Return false if the comment is not found
            return false;
        }

        // Check if the user is liking, disliking, or removing their like/dislike
        const isLike = likeStatus === "Like";
        const isDislike = likeStatus === "Dislike";
        const isNone = likeStatus === "None";

        // Check if the user has already liked or disliked the comment
        const isLiked = comment.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment.usersLikesInfo.usersWhoPutDislike.includes(userId);
        // Declare an update object that will be used to update the comment

        let update: any = {};

        // Update the like/dislike count and user lists based on the likeStatus
        if (isLike && !isLiked && !isDisliked) {
            // Increment the like count and add the user to the list of users who liked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount + 1,
                "likesInfo.myStatus": likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutLike": userId
                },
            };
        } else if (isDislike && !isDisliked && !isLiked) {
            // Increment the dislike count and add the user to the list of users who disliked the comment
            update = {
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount + 1,
                "likesInfo.myStatus": likeStatus,
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": userId
                },
            };
        } else if (isLiked && isDislike) {
            // Decrement the like count, increment the dislike count, and update the lists of users who liked/disliked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount - 1,
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount + 1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutLike": userId ,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutDislike": userId,
                },
            };
        } else if (isDisliked && isLike) {
            // Decrement the dislike count, increment the like count, and update the lists of users who liked/disliked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount + 1,
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount -1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": userId ,
                },
                $push: {
                    "usersLikesInfo.usersWhoPutLike": userId,
                },
            };

        } else if (isLiked && isNone) {
            // Decrement the like count, and update the lists of users who liked the comment
            update = {
                "likesInfo.likesCount": comment.likesInfo.likesCount - 1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutLike": userId ,
                },
            };

        } else if (isDisliked && isNone) {
            // Decrement the dislike count, and update the lists of users who disliked the comment
            update = {
                "likesInfo.dislikesCount": comment.likesInfo.dislikesCount -1,
                "likesInfo.myStatus": likeStatus,
                $pull: {
                    "usersLikesInfo.usersWhoPutDislike": userId  ,
                },
            };
        }

        return  this.commentsRepository.likeOperation(id,update)
    }
}




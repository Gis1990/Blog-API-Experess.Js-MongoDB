import {CommentDBClass, CommentDBClassPagination} from "../types/types";
import {CommentsModelClass} from "./db";
import {injectable} from "inversify";




@injectable()
export class CommentsQueryRepository {
    async getCommentById(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({id: id}, {_id: 0, postId: 0,usersLikesInfo:0 })
    }
    async getAllCommentsForSpecificPost(pageNumber: number, pageSize: number,sortBy:string,sortDirection:string, postId: string): Promise<CommentDBClassPagination> {
        const skips = pageSize * (pageNumber - 1)
        let sortObj:any={}
        if (sortDirection==="desc"){
            sortObj[sortBy]=-1
            }else{
            sortObj[sortBy]=1
            }
        const cursor = await CommentsModelClass.find({postId: postId}, {
            _id: 0,
            postId: 0,
            usersLikesInfo:0
        }).sort(sortObj).skip(skips).limit(pageSize).lean()
        const totalCount = await CommentsModelClass.count({postId: postId})
        return new CommentDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor)
    }
    async getCommentByIdForLikeOperation(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({id: id})
    }
    async returnUsersLikeStatus(id: string,userId:string): Promise<string> {
        const comment = await CommentsModelClass.findOne({id: id});

        const isLiked = comment?.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment?.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
    }
}



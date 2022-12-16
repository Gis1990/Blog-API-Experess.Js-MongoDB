import {CommentDBClass, CommentDBClassPagination} from "../types/types";
import {CommentsModelClass} from "./db";





export class CommentsRepository {
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

    async createComment(comment: CommentDBClass): Promise<CommentDBClass> {
        await CommentsModelClass.insertMany([comment]);
        return comment;
    }

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await CommentsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await CommentsModelClass.updateOne({id: id}, {$set: {content}})
        return result.matchedCount === 1
    }

    async likeOperation(id: string, userId: string, likeStatus: string): Promise<boolean> {
        const comment = await CommentsModelClass.findOne({ id: id });
        if (!comment) {
            return false;
        }

        let likesCount = comment.likesInfo.likesCount;
        let dislikesCount = comment.likesInfo.dislikesCount;

        const isLike = likeStatus === "Like";
        const isDislike = likeStatus === "Dislike";
        const isNone = likeStatus === "None";

        const isLiked = comment.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLike && !isLiked && !isDisliked) {
            likesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutLike": userId } });
        } else if (isDislike && !isDisliked && !isLiked) {
            dislikesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
        } else if (isLiked && isDislike) {
            likesCount--;
            dislikesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutLike": userId } });
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
        } else if (isDisliked && isLike) {
            dislikesCount--;
            likesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutLike": userId } });
        } else if (isLiked && isNone) {
            likesCount--;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutLike": userId } });
        } else if (isDisliked && isNone) {
            dislikesCount--;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
        }

        const result = await CommentsModelClass.updateOne({ id: id }, {
            $set: {
                "likesInfo.likesCount": likesCount,
                "likesInfo.dislikesCount": dislikesCount,
                "likesInfo.myStatus": likeStatus,
            },
        });

        return result.matchedCount === 1;
    }
    async returnUsersLikeStatus(id: string,userId:string): Promise<string> {
        const comment = await CommentsModelClass.findOne({id: id})
        const findUsersLikes=comment!.usersLikesInfo.usersWhoPutLike.filter(user => user === userId)
        const findUsersDislikes=comment!.usersLikesInfo.usersWhoPutDislike.filter(user => user === userId)
        if (findUsersLikes!.length===1){
            return "Like"
        }
        if (findUsersDislikes!.length===1){
            return "Dislike"
        }
        return "None"
    }
}



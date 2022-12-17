import {CommentDBClass} from "../types/types";
import {CommentsModelClass} from "./db";

export class CommentsRepository {
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
        // Find the comment with the given id
        const comment = await CommentsModelClass.findOne({ id: id });
        if (!comment) {
            // Return false if the comment is not found
            return false;
        }

        // Get the current like and dislike count for the comment
        let likesCount = comment.likesInfo.likesCount;
        let dislikesCount = comment.likesInfo.dislikesCount;

        // Check if the user is liking, disliking, or removing their like/dislike
        const isLike = likeStatus === "Like";
        const isDislike = likeStatus === "Dislike";
        const isNone = likeStatus === "None";

        // Check if the user has already liked or disliked the comment
        const isLiked = comment.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = comment.usersLikesInfo.usersWhoPutDislike.includes(userId);

        // Update the like/dislike count and user lists based on the likeStatus
        if (isLike && !isLiked && !isDisliked) {
            // Increment the like count and add the user to the list of users who liked the comment
            likesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutLike": userId } });
        } else if (isDislike && !isDisliked && !isLiked) {
            // Increment the dislike count and add the user to the list of users who disliked the comment
            dislikesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
        } else if (isLiked && isDislike) {
            // Decrement the like count, increment the dislike count, and update the lists of users who liked/disliked the comment
            likesCount--;
            dislikesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutLike": userId } });
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutDislike": userId } });
        } else if (isDisliked && isLike) {
            // Decrement the dislike count, increment the like count, and update the lists of users who liked/disliked the comment
            dislikesCount--;
            likesCount++;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
            await CommentsModelClass.updateOne({ id: id }, { $push: { "usersLikesInfo.usersWhoPutLike": userId } });
        } else if (isLiked && isNone) {
            // Decrement the like count, and update the lists of users who liked the comment
            likesCount--;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutLike": userId } });
        } else if (isDisliked && isNone) {
            // Decrement the dislike count, and update the lists of users who disliked the comment
            dislikesCount--;
            await CommentsModelClass.updateOne({ id: id }, { $pull: { "usersLikesInfo.usersWhoPutDislike": userId } });
        }

        const result = await CommentsModelClass.updateOne(
            { id: id },
            {
                $set: {
                    "likesInfo.likesCount": likesCount,
                    "likesInfo.dislikesCount": dislikesCount,
                    "likesInfo.myStatus": likeStatus,
                },
            },
        );

        return result.matchedCount === 1;
    }
}



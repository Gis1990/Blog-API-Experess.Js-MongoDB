import { NewestLikesClass, PostDBClass, PostDBClassPagination} from "../types/types";
import {PostsModelClass} from "./db";


export class PostsRepository {
    async getAllPosts(pageNumber: number, pageSize: number,sortBy:string,sortDirection:string): Promise<PostDBClassPagination> {
        const skips = pageSize * (pageNumber - 1);
        const totalCount = await PostsModelClass.count({});
        let sortObj:any={}
        if (sortDirection==="desc"){
             sortObj[sortBy]=-1
        }else{
            sortObj[sortBy]=1
        }
        const cursor = await PostsModelClass.find({}, { _id: 0, usersLikesInfo: 0 }).sort(sortObj).skip(skips).limit(pageSize).lean();
        return new PostDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }
    async getAllPostsForSpecificBlog(
        pageNumber: number,
        pageSize: number,
        blogId: string,
        sortBy:string,
        sortDirection:string
    ): Promise<PostDBClassPagination> {
        let cursor
        const skips = pageSize * (pageNumber - 1);
        let sortObj:any={}
        const totalCount = await PostsModelClass.count({ blogId: blogId });
        if (sortDirection==="desc"){
             sortObj[sortBy]=-1
             cursor = await PostsModelClass.find({ blogId: blogId }, { _id: 0, usersLikesInfo: 0 })
                .sort(sortObj)
                .skip(skips)
                .limit(pageSize)
                .lean();
        }else{
            sortObj[sortBy]=1
            cursor = await PostsModelClass.find({ blogId: blogId }, { _id: 0, usersLikesInfo: 0 })
                .sort(sortObj)
                .skip(skips)
                .limit(pageSize)
                .lean();
        }

        return new PostDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
    }
    async getPostById(id: string): Promise<PostDBClass | null> {
        return PostsModelClass.findOne({ id: id }, { _id: 0, usersLikesInfo: 0 });
    }
    async createPost(post: PostDBClass): Promise<PostDBClass> {
        await PostsModelClass.insertMany([post]);
        return post;
    }
    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<boolean> {
        const post = await PostsModelClass.findOne({ id: id });
        let blogName;
        if (post) {
            blogName = post.blogName;
        }
        const result = await PostsModelClass.updateOne(
            { id: id },
            { $set: { title, shortDescription, content, blogId, blogName } },
        );
        return result.matchedCount === 1;
    }
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
    async likeOperation(id: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        // Find the post with the given ID
        const post = await PostsModelClass.findOne({ id: id });

// If the post does not exist, return false
        if (!post) {
            return false;
        }

// Check if the user has already liked or disliked the post
        const isLiked = post.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = post.usersLikesInfo.usersWhoPutDislike.includes(userId);

// Declare an update object that will be used to update the post
        let update: any = {};

// If the user wants to like the post and has not already liked or disliked it,
// increase the likes count and add the user to the list of users who liked the post
        if (likeStatus === "Like" && !isLiked && !isDisliked) {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                "extendedLikesInfo.newestLikes": new NewestLikesClass(new Date(), userId, login),
                "usersLikesInfo.usersWhoPutLike": userId
            };
        }

// If the user wants to dislike the post and has not already liked or disliked it,
// increase the dislikes count and add the user to the list of users who disliked the post
        else if (likeStatus === "Dislike" && !isDisliked && !isLiked) {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                "usersLikesInfo.usersWhoPutDislike": userId
            };
        }

// If the user has already liked the post and wants to dislike it,
// decrease the likes count, increase the dislikes count,
// remove the user from the list of users who liked the post, and add them to the list of users who disliked the post
        else if (isLiked && likeStatus === "Dislike") {
            update = {
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount - 1,
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                "$pull": {
                    "extendedLikesInfo.newestLikes": { userId: userId },
                    "usersLikesInfo.usersWhoPutLike": userId
                },
                "$push": {
                    "usersLikesInfo.usersWhoPutDislike": userId
                }
            };
        }

// If the user has already disliked the post and wants to like it,
// decrease the dislikes count, increase the likes count,
// remove the user from the list of users who disliked the post, and add them to the list of users who liked the post
        else if (isDisliked && likeStatus === "Like") {
            update = {
                "extendedLikesInfo.dislikesCount": post.extendedLikesInfo.dislikesCount - 1,
                "extendedLikesInfo.likesCount": post.extendedLikesInfo.likesCount + 1,
                "extendedLikesInfo.myStatus": likeStatus,
                "$pull": {
                    "usersLikesInfo.usersWhoPutDislike": userId
                },
                "$push": {
                    "extendedLikesInfo.newestLikes": new NewestLikesClass(new Date(), userId, login),
                    "usersLikesInfo.usersWhoPutLike": userId
                }
            };
        }

        const result = await PostsModelClass.updateOne({ id: id }, update);
        return result.matchedCount === 1;
    }
    async returnUsersLikeStatus(id: string, userId: string): Promise<string> {
        const post = await PostsModelClass.findOne({id: id});

        if (post?.usersLikesInfo.usersWhoPutLike.includes(userId)) {
            return "Like";
        } else if (post?.usersLikesInfo.usersWhoPutDislike.includes(userId)) {
            return "Dislike";
        } else {
            return "None";
        }
    }
}


















import {  PostDBClass, PostDBClassPagination} from "../types/types";
import {PostsModelClass} from "./db";


export class PostsQueryRepository {
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

















import { PostDBClass, PostDBClassPagination} from "./types";
import {PostsModelClass} from "./db";
import {GetPostClass} from "./types";

export class PostsRepository  {
    async getAllPosts(PageNumber:number,PageSize:number):Promise<PostDBClassPagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor=await PostsModelClass.find({}, { _id:0 }).skip(skips).limit(PageSize).lean()
        const totalCount=await PostsModelClass.count({})
        return new PostDBClassPagination(Math.ceil(totalCount/PageSize),PageNumber,PageSize,totalCount,cursor)
    }
    async getAllPostsForSpecificBlogger(PageNumber:number,PageSize:number,bloggerId:string):Promise<PostDBClassPagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor=await PostsModelClass.find({bloggerId:bloggerId},{ _id:0 }).skip(skips).limit(PageSize).lean()
        const totalCount=await PostsModelClass.count({bloggerId:bloggerId})
        return new PostDBClassPagination(Math.ceil(totalCount/PageSize),PageNumber,PageSize,totalCount,cursor)
    }
    async getPostById(id: string):Promise<GetPostClass|null> {
        return PostsModelClass.findOne({ id: id },{_id:0})
    }
    async createPost(post: PostDBClass):Promise<PostDBClass> {
        await PostsModelClass.insertMany([post]);
        return post;
    }
    async updatePost(id: string,title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const post=await PostsModelClass.findOne({id:id})
        let bloggerName
        if (post){
            bloggerName=post.bloggerName
        }
        const result=await PostsModelClass.updateOne({id:id},{$set:{title,shortDescription,content,bloggerId,bloggerName}})
        return result.matchedCount===1
    }
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }
}


















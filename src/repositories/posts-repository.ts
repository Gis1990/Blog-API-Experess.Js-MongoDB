import { PostDBType, PostDBTypePagination} from "./types";
import {PostsModel} from "./db";

export const postsRepository = {
    async getAllPosts(PageNumber:number,PageSize:number):Promise<PostDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor=await PostsModel.find({}, { projection: { _id:0 } }).skip(skips).limit(PageSize).lean()
        const totalCount=await PostsModel.count({})
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async getAllPostsForSpecificBlogger(PageNumber:number,PageSize:number,bloggerId:string):Promise<PostDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        const cursor=await PostsModel.find({bloggerId:bloggerId}, { projection: { _id:0 } }).skip(skips).limit(PageSize).lean()
        const totalCount=await PostsModel.count({bloggerId:bloggerId})
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async getPostById(id: string):Promise<PostDBType|null> {
        return PostsModel.findOne({ id: id },{ projection:{_id:0}})
    },
    async createPost(post: PostDBType):Promise<PostDBType> {
        await PostsModel.insertMany([post]);
        return post;
    },
    async updatePost(id: string,title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        const post=await PostsModel.findOne({id:id})
        let bloggerName
        if (post){
            bloggerName=post.bloggerName
        }
        const result=await PostsModel.updateOne({id:id},{$set:{title,shortDescription,content,bloggerId,bloggerName}})
        return result.matchedCount===1
    },
    async deletePostById(id: string): Promise<boolean> {
        const result = await PostsModel.deleteOne({id: id});
        return result.deletedCount === 1
    }
}
















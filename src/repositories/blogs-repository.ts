import {BlogDBClass, BlogDBClassPagination} from "../types/types";
import {BlogsModelClass} from "./db";


export class BlogsRepository {
    async getAllBlogs(SearchNameTerm:string|null, PageNumber:number, PageSize:number):Promise<BlogDBClassPagination> {
        const skips = PageSize * (PageNumber - 1)
        let cursor
        let totalCount
        if (SearchNameTerm) {
            cursor = await BlogsModelClass.find({name: {$regex: SearchNameTerm}}, {_id: 0}).skip(skips).limit(PageSize).lean()
            totalCount = await BlogsModelClass.count({name: {$regex: SearchNameTerm}})
        } else {
            cursor = await BlogsModelClass.find({}, {_id: 0}).skip(skips).limit(PageSize).sort({ "createdAt": -1 }).lean()
            totalCount = await BlogsModelClass.count({})
        }
        return new BlogDBClassPagination(Math.ceil(totalCount/PageSize),PageNumber,PageSize,totalCount,cursor)

    }
    async getBlogById(id: string):Promise<BlogDBClass|null>{
        return BlogsModelClass.findOne({ id: id }, { _id:0 } )
    }
    async createBlog(blog: BlogDBClass):Promise<BlogDBClass> {
        await BlogsModelClass.insertMany([blog]);
        return blog;
    }
    async updateBlog(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        const result=await BlogsModelClass.updateOne({id:id},{$set:{name,youtubeUrl}})
        return result.matchedCount===1
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }
}








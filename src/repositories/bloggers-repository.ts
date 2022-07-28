import {BloggerDBClass, BloggerDBClassPagination} from "./types";
import {BloggersModelClass} from "./db";


export class  BloggersRepository  {
    async getAllBloggers(SearchNameTerm:string|null,PageNumber:number,PageSize:number):Promise<BloggerDBClassPagination> {
        const skips = PageSize * (PageNumber - 1)
        let cursor
        let totalCount
        if (SearchNameTerm) {
            cursor = await BloggersModelClass.find({name: {$regex: SearchNameTerm}}, {_id: 0}).skip(skips).limit(PageSize).lean()
            totalCount = await BloggersModelClass.count({name: {$regex: SearchNameTerm}})
        } else {
            cursor = await BloggersModelClass.find({}, {_id: 0}).skip(skips).limit(PageSize).lean()
            totalCount = await BloggersModelClass.count({})
        }
        return new BloggerDBClassPagination(Math.ceil(totalCount/PageSize),PageNumber,PageSize,totalCount,cursor)

    }
    async getBloggerById(id: string):Promise<BloggerDBClass|null>{
        return BloggersModelClass.findOne({ id: id }, { _id:0 } )
    }
    async createBlogger(blogger: BloggerDBClass):Promise<BloggerDBClass> {
        await BloggersModelClass.insertMany([blogger]);
        return blogger;
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        const result=await BloggersModelClass.updateOne({id:id},{$set:{name,youtubeUrl}})
        return result.matchedCount===1
    }
    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await BloggersModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }
}








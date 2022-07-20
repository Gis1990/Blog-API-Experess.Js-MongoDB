import {BloggerDBType, BloggerDBTypePagination} from "./types";
import {BloggersModelClass} from "./db";


export const bloggersRepository = {
    async getAllBloggers(SearchNameTerm:string|null,PageNumber:number,PageSize:number):Promise<BloggerDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        let cursor
        let totalCount
        if (SearchNameTerm) {
            cursor =await BloggersModelClass.find({name: { $regex: SearchNameTerm }}, { _id:0 }).skip(skips).limit(PageSize).lean()
            totalCount=await BloggersModelClass.count({name: { $regex: SearchNameTerm }})
        } else{
            cursor =await BloggersModelClass.find({},  { _id:0 }).skip(skips).limit(PageSize).lean()
            totalCount=await BloggersModelClass.count({})
        }
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async getBloggerById(id: string):Promise<BloggerDBType|null>{
        return BloggersModelClass.findOne({ id: id }, { _id:0 } )
    },
    async createBlogger(blogger: BloggerDBType):Promise<BloggerDBType> {
        await BloggersModelClass.insertMany([blogger]);
        return blogger;
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        const result=await BloggersModelClass.updateOne({id:id},{$set:{name,youtubeUrl}})
        return result.matchedCount===1
    },
    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await BloggersModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    },
}




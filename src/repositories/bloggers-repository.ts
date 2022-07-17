import {BloggerDBType, BloggerDBTypePagination} from "./types";
import {BloggersModel} from "./db";


export const bloggersRepository = {
    async getAllBloggers(SearchNameTerm:string|null,PageNumber:number,PageSize:number):Promise<BloggerDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        let cursor
        let totalCount
        if (SearchNameTerm) {
            cursor =await BloggersModel.find({name: { $regex: SearchNameTerm }}, { projection: { _id:0 } }).skip(skips).limit(PageSize).lean()
            totalCount=await BloggersModel.count({name: { $regex: SearchNameTerm }})
        } else{
            cursor =await BloggersModel.find({}, { projection: { _id:0 } }).skip(skips).limit(PageSize).lean()
            totalCount=await BloggersModel.count({})
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
        return BloggersModel.findOne({ id: id }, { projection: { _id:0 } })
    },
    async createBlogger(blogger: BloggerDBType):Promise<BloggerDBType> {
        await BloggersModel.insertMany([blogger]);
        return blogger;
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        const result=await BloggersModel.updateOne({id:id},{$set:{name,youtubeUrl}})
        return result.matchedCount===1
    },
    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await BloggersModel.deleteOne({id: id});
        return result.deletedCount === 1
    },
}




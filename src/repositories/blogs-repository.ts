import {BlogDBClass, BlogDBClassPagination} from "../types/types";
import {BlogsModelClass} from "./db";


export class BlogsRepository {
    async getAllBlogs(SearchNameTerm:string|null,pageNumber:number,pageSize:number,sortBy:string,sortDirection:string):Promise<BlogDBClassPagination> {
        const skips = pageSize * (pageNumber - 1)
        let sortParameter1=`${-sortBy}`
        let sortParameter2=`${sortBy}`
        console.log(sortBy,sortDirection)
        let cursor
        let totalCount
        if (SearchNameTerm) {
            if (sortDirection==="desc"){
                cursor = await BlogsModelClass.find({name: {$regex: SearchNameTerm}}, {_id: 0}).sort(sortParameter1).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({name: {$regex: SearchNameTerm}})
            }else{
                cursor = await BlogsModelClass.find({}, {_id: 0}).sort(sortParameter2).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({})
            }
        }else{
            if (sortDirection==="desc"){
                cursor = await BlogsModelClass.find({},  {_id: 0}).sort(sortParameter1).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({})
            }else{
                cursor = await BlogsModelClass.find({},  {_id: 0}).sort(sortParameter2).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({})
        }
    }
        return new BlogDBClassPagination(Math.ceil(totalCount/pageSize),pageNumber,pageSize,totalCount,cursor)

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








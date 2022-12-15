import {BlogDBClass, BlogDBClassPagination} from "../types/types";
import {BlogsModelClass} from "./db";


export class BlogsRepository {
    async getAllBlogs(searchNameTerm:string|null,pageNumber:number,pageSize:number,sortBy:string,sortDirection:string):Promise<BlogDBClassPagination> {
        const skips = pageSize * (pageNumber - 1)
        let cursor
        let totalCount
        let sortObj:any={}
        if (searchNameTerm) {
            if (sortDirection==="desc"){
                sortObj[sortBy]=-1
                cursor = await BlogsModelClass.find({name: {$regex: searchNameTerm, $options: 'i'}}, {_id: 0}).sort(sortObj).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({name: {$regex: searchNameTerm, $options: 'i'}})
            }else{
                sortObj[sortBy]=1
                cursor = await BlogsModelClass.find({name: {$regex: searchNameTerm, $options: 'i'}}, {_id: 0}).sort(sortObj).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({name: {$regex: searchNameTerm, $options: 'i'}})
            }
        }else{
            if (sortDirection==="desc"){
                sortObj[sortBy]=-1
                cursor = await BlogsModelClass.find({},  {_id: 0}).sort(sortObj).skip(skips).limit(pageSize).lean()
                totalCount = await BlogsModelClass.count({})
            }else{
                sortObj[sortBy]=1
                cursor = await BlogsModelClass.find({},  {_id: 0},).sort(sortObj).skip(skips).limit(pageSize).lean()
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
    async updateBlog(id: string, name: string,description: string, websiteUrl: string):Promise<boolean> {
        const result=await BlogsModelClass.updateOne({id:id},{$set:{name,description,websiteUrl}})
        return result.matchedCount===1
    }
    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogsModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }
}








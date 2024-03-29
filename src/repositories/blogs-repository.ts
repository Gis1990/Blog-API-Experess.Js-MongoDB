import {BlogDBClass, BlogViewModelClass} from "../classes/classes";
import {BlogsModelClass} from "./db";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async createBlog(blog: BlogDBClass):Promise<BlogViewModelClass> {
        await BlogsModelClass.insertMany([blog]);
        return await blog.transformToBlogViewModelClass();
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








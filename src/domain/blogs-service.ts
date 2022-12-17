import {ObjectId} from 'mongodb'
import {BlogsRepository} from "../repositories/blogs-repository";
import {NewBlogClassResponseModel, BlogDBClass} from "../types/types";




export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}
    async createBlog(name: string,description:string, websiteUrl: string): Promise<NewBlogClassResponseModel> {
        let blog: BlogDBClass = new BlogDBClass (new ObjectId(),Number((new Date())).toString() ,name,description, websiteUrl,new Date())
        const newBlog=await this.blogsRepository.createBlog(blog)
        const {_id,...newBlogRest}=newBlog
        return  newBlogRest
    }
    async updateBlog(id: string, name: string, description:string,websiteUrl: string): Promise<boolean> {
        return  this.blogsRepository.updateBlog(id, name,description, websiteUrl)
    }
    async deleteBlog(id: string): Promise<boolean> {
        return  this.blogsRepository.deleteBlogById(id)
    }
}






import {ObjectId} from 'mongodb'
import {BlogsRepository} from "../repositories/blogs-repository";
import {NewBlogClassResponseModel, BlogDBClass, BlogDBClassPagination} from "../types/types";




export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}
    async getAllBlogs(obj:{searchNameTerm?:string|null,pageNumber?:number,pageSize?:number,sortBy?:string,sortDirection?:string}): Promise<BlogDBClassPagination> {
        const {searchNameTerm=null,pageNumber=1,pageSize=10,sortBy="createdAt",sortDirection="desc"}=obj
        return  this.blogsRepository.getAllBlogs(searchNameTerm,Number(pageNumber),Number(pageSize),sortBy,sortDirection)
    }
    async getBlogById(id: string): Promise<BlogDBClass | null> {
        return this.blogsRepository.getBlogById(id)
    }
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






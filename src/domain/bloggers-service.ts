import {ObjectId} from 'mongodb'
import {BloggersRepository} from "../repositories/bloggers-repository";
import {NewBloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination} from "../types/types";




export class BloggersService {
    constructor(protected bloggersRepository: BloggersRepository) {}
    async getAllBloggers(obj:{SearchNameTerm?:string|null,PageNumber?:number,PageSize?:number}): Promise<BloggerDBClassPagination> {
        const {SearchNameTerm=null,PageNumber=1,PageSize=10}=obj
        return  this.bloggersRepository.getAllBloggers(SearchNameTerm,Number(PageNumber),Number(PageSize))
    }
    async getBloggerById(id: string): Promise<BloggerDBClass | null> {
        return this.bloggersRepository.getBloggerById(id)
    }
    async createBlogger( name: string, youtubeUrl: string): Promise<NewBloggerClassResponseModel> {
        let blogger: BloggerDBClass = new BloggerDBClass (new ObjectId(),Number((new Date())).toString() ,name, youtubeUrl)
        const newBlogger=await this.bloggersRepository.createBlogger(blogger)
        const {_id,...newBloggerRest}=newBlogger
        return  newBloggerRest
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return  this.bloggersRepository.updateBlogger(id, name, youtubeUrl)
    }
    async deleteBlogger(id: string): Promise<boolean> {
        return  this.bloggersRepository.deleteBloggerById(id)
    }
}






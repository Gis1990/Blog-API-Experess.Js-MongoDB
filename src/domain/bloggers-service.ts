import {ObjectId} from 'mongodb'
import {BloggersRepository} from "../repositories/bloggers-repository";
import {BloggerDBClass, BloggerDBClassPagination} from "../repositories/types";


export class BloggersService {
    constructor(protected bloggersRepository: BloggersRepository) {}
    async getAllBloggers(obj:{SearchNameTerm?:string|null,PageNumber?:number,PageSize?:number}): Promise<BloggerDBClassPagination> {
        const {SearchNameTerm=null,PageNumber=1,PageSize=10}=obj
        return  this.bloggersRepository.getAllBloggers(SearchNameTerm,Number(PageNumber),Number(PageSize))
    }
    async getBloggerById(id: string): Promise<BloggerDBClass | null> {
        return this.bloggersRepository.getBloggerById(id)
    }
    async createBlogger( name: string, youtubeUrl: string): Promise<BloggerDBClass> {
        let blogger: BloggerDBClass = new BloggerDBClass (new ObjectId(),Number((new Date())).toString() ,name, youtubeUrl)
        return  this.bloggersRepository.createBlogger(blogger)
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return  this.bloggersRepository.updateBlogger(id, name, youtubeUrl)
    }
    async deleteBlogger(id: string): Promise<boolean> {
        return  this.bloggersRepository.deleteBloggerById(id)
    }
}





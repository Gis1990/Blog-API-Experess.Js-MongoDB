import {ObjectId} from 'mongodb'
import {bloggersRepository} from "../repositories/bloggers-repository";
import {BloggerDBType, BloggerDBTypePagination} from "../repositories/types";



export const bloggersService = {
    async getAllBloggers(obj:{SearchNameTerm?:string|null,PageNumber?:number,PageSize?:number}): Promise<BloggerDBTypePagination> {
        const {SearchNameTerm=null,PageNumber=1,PageSize=10}=obj
        return  bloggersRepository.getAllBloggers(SearchNameTerm,Number(PageNumber),Number(PageSize))
    },
    async getBloggerById(id: string): Promise<BloggerDBType | null> {
        return bloggersRepository.getBloggerById(id)
    },
    async createBlogger( name: string, youtubeUrl: string): Promise<BloggerDBType> {
        const id=Number((new Date())).toString()
        let blogger = {_id: new ObjectId(),id ,name, youtubeUrl}
        return  bloggersRepository.createBlogger(blogger)
    },
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return  bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },
    async deleteBlogger(id: string): Promise<boolean> {
        return  bloggersRepository.deleteBloggerById(id)
    }
}


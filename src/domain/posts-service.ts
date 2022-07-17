import {ObjectId} from 'mongodb'
import {postsRepository} from "../repositories/posts-repository";
import {PostDBType, PostDBTypePagination} from "../repositories/types";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const postsService = {
    async getAllPosts(obj:{PageNumber?:number,PageSize?:number}): Promise<PostDBTypePagination> {
        const {PageNumber=1,PageSize=10}=obj
        return postsRepository.getAllPosts(Number(PageNumber),Number(PageSize))
    },
    async getAllPostsForSpecificBlogger(obj:{PageNumber?:number,PageSize?:number},bloggerId:string): Promise<PostDBTypePagination> {
        const {PageNumber=1,PageSize=10}=obj
        return postsRepository.getAllPostsForSpecificBlogger(Number(PageNumber),Number(PageSize),bloggerId)
    },
    async getPostById(id: string): Promise<PostDBType | null> {
        return postsRepository.getPostById(id)
    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostDBType> {
        const blogger=await bloggersRepository.getBloggerById(bloggerId)
        let bloggerName
        (blogger)?bloggerName=blogger.name:bloggerName=""
        const id=Number((new Date())).toString()
        const post= {_id: new ObjectId(),id, title, shortDescription,content,bloggerId,bloggerName}
        return  postsRepository.createPost(post)
    },
    async updatePost(id: string,title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        return  postsRepository.updatePost(id, title, shortDescription,content,bloggerId)
    },
    async deletePost(id: string): Promise<boolean> {
        return  postsRepository.deletePostById(id)
    }
}
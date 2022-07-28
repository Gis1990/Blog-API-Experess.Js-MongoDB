import {ObjectId} from 'mongodb'
import {PostsRepository} from '../repositories/posts-repository'
import {LikesInfoClass, PostDBClass, PostDBClassPagination} from "../repositories/types";
import {GetPostClass} from "../repositories/types";
import {BloggersRepository} from "../repositories/bloggers-repository";


export class PostsService  {
    constructor(protected postsRepository: PostsRepository,protected bloggersRepository: BloggersRepository) {}
    async getAllPosts(obj:{PageNumber?:number,PageSize?:number}): Promise<PostDBClassPagination> {
        const {PageNumber=1,PageSize=10}=obj
        return this.postsRepository.getAllPosts(Number(PageNumber),Number(PageSize))
    }
    async getAllPostsForSpecificBlogger(obj:{PageNumber?:number,PageSize?:number},bloggerId:string): Promise<PostDBClassPagination> {
        const {PageNumber=1,PageSize=10}=obj
        return this.postsRepository.getAllPostsForSpecificBlogger(Number(PageNumber),Number(PageSize),bloggerId)
    }
    async getPostById(id: string): Promise<GetPostClass | null> {
        return this.postsRepository.getPostById(id)
    }
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostDBClass> {
        const blogger=await this.bloggersRepository.getBloggerById(bloggerId)
        let bloggerName
        (blogger)?bloggerName=blogger.name:bloggerName=""
        const likes: LikesInfoClass= new LikesInfoClass(0,0,"None")
        let post:PostDBClass=new PostDBClass(new ObjectId, Number((new Date())).toString(),title,shortDescription,content,bloggerId,bloggerName,likes)
        return  this.postsRepository.createPost(post)
    }
    async updatePost(id: string,title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean> {
        return  this.postsRepository.updatePost(id, title, shortDescription,content,bloggerId)
    }
    async deletePost(id: string): Promise<boolean> {
        return  this.postsRepository.deletePostById(id)
    }
}


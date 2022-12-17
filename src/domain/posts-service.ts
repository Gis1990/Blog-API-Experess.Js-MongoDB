import {ObjectId} from 'mongodb'
import {PostsRepository} from '../repositories/posts-repository'
import {
    ExtendedLikesInfoClass,
    NewPostClassResponseModel,
    PostDBClass,
    UsersLikesInfoClass
} from "../types/types";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";



export class PostsService {
    constructor(protected postsRepository: PostsRepository,protected blogsQueryRepository: BlogsQueryRepository) {}
    async createPost(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<NewPostClassResponseModel> {
        const blog = await this.blogsQueryRepository.getBlogById(blogId);
        let blogName;
        blog ? (blogName = blog.name) : (blogName = "");
        const likesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass(0, 0, "None", []);
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass([], []);
        const post: PostDBClass = new PostDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            new Date(),
            likesInfo,
            usersLikesInfo,
        );
        const newPost = await this.postsRepository.createPost(post);
        return (({ id, title, shortDescription, content, blogId, blogName, createdAt, extendedLikesInfo }) => ({
            id,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt,
            extendedLikesInfo,
        }))(newPost);
    }
    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<boolean> {
        return this.postsRepository.updatePost(id, title, shortDescription, content, blogId);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id);
    }
    async likeOperation(id: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        return this.postsRepository.likeOperation(id, userId, login, likeStatus);
    }
}


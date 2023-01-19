import {ExtendedLikesInfoClass, PostDBClass, PostViewModelClass, UsersLikesInfoClass} from "../../../classes/classes";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../../../repositories/posts-repository";
import {BlogsQueryRepository} from "../../../repositories/query-repositories/blogs-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CreatePostUseCase {
    constructor(@inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository, @inject(PostsRepository) private postsRepository: PostsRepository) {}

    async execute(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<PostViewModelClass> {
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
        return await this.postsRepository.createPost(post)

    }
}

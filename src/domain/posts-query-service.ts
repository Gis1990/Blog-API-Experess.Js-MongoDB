
import {
    PostDBClass,
    PostDBClassPagination,
} from "../types/types";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {inject, injectable} from "inversify";


@injectable()
export class PostsQueryService {
    constructor(@inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(BlogsQueryRepository)private blogsQueryRepository: BlogsQueryRepository) {
    }
    async getAllPosts(obj: { pageNumber?: number, pageSize?: number, sortBy?: string, sortDirection?: string }, userId: string | undefined): Promise<PostDBClassPagination> {
        const {pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = obj
        const allPosts = await this.postsQueryRepository.getAllPosts(Number(pageNumber), Number(pageSize), sortBy, sortDirection);
        if (userId) {
            for (let i = 0; i < allPosts.items.length; i++) {
                allPosts.items[i].extendedLikesInfo.newestLikes = allPosts.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                allPosts.items[i].extendedLikesInfo.myStatus = await this.postsQueryRepository.returnUsersLikeStatus(
                    allPosts.items[i].id,
                    userId,
                );
            }
        } else {
            allPosts.items.forEach((elem) => (elem.extendedLikesInfo.myStatus = "None"));
            allPosts.items.forEach(
                (elem) =>
                    (elem.extendedLikesInfo.newestLikes = elem.extendedLikesInfo.newestLikes
                        .slice(-3)
                        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())),
            );
        }
        return allPosts;
    }

    async getAllPostsForSpecificBlog(
        obj: { pageNumber?: number, pageSize?: number, sortBy?: string, sortDirection?: string },
        blogId: string,
        userId: string | undefined,
    ): Promise<PostDBClassPagination> {
        const {pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc"} = obj
        const posts = await this.postsQueryRepository.getAllPostsForSpecificBlog(
            Number(pageNumber),
            Number(pageSize),
            blogId,
            sortBy,
            sortDirection
        );
        if (userId) {
            for (let i = 0; i < posts.items.length; i++) {
                posts.items[i].extendedLikesInfo.newestLikes = posts.items[i].extendedLikesInfo.newestLikes
                    .slice(-3)
                    .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
                posts.items[i].extendedLikesInfo.myStatus = await this.postsQueryRepository.returnUsersLikeStatus(
                    posts.items[i].id,
                    userId,
                );
            }
        } else {
            posts.items.forEach(
                (elem) =>
                    (elem.extendedLikesInfo.newestLikes = elem.extendedLikesInfo.newestLikes
                        .slice(-3)
                        .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())),
            );
            posts.items.forEach((elem) => (elem.extendedLikesInfo.myStatus = "None"));
        }
        return posts;
    }

    async getPostById(id: string, userId: string | undefined): Promise<PostDBClass | null> {
        const post = await this.postsQueryRepository.getPostById(id);
        if (!post) {
            return null;
        }
        post.extendedLikesInfo.newestLikes = post?.extendedLikesInfo.newestLikes
            .slice(-3)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        if (userId) {
            post.extendedLikesInfo.myStatus = await this.postsQueryRepository.returnUsersLikeStatus(id, userId);
        } else {
            post.extendedLikesInfo.myStatus = "None";
        }
        return post;
    }
}


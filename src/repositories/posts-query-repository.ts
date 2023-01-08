import {PostDBClass, PostDBPaginationClass, PostViewModelClass} from "../types/classes";
import {PostsModelClass} from "./db";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {
    async getAllPosts(obj: { pageNumber?: number, pageSize?: number, sortBy?: string, sortDirection?: string}, userId: string | undefined): Promise<PostDBPaginationClass> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = obj;
        const skips = pageSize * (pageNumber - 1);
        const totalCount = await PostsModelClass.count({});
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const cursor = await PostsModelClass.find({}).sort(sortObj).skip(skips).limit(pageSize);
        const cursorWithCorrectViewModel: PostViewModelClass[]=[]
        cursor.forEach((elem) => {
            const postDB = elem as PostDBClass;
            postDB.returnUsersLikeStatusForPost(userId);
            cursorWithCorrectViewModel.push(new PostViewModelClass(postDB.id,
                postDB.title,
                postDB.shortDescription,
                postDB.content,
                postDB.blogId,
                postDB.blogName,
                postDB.createdAt,
                postDB.extendedLikesInfo))
        });
        return new PostDBPaginationClass(
            Math.ceil(totalCount / pageSize),
            pageNumber,
            pageSize,
            totalCount,
            cursorWithCorrectViewModel,
        );
    }
    async getAllPostsForSpecificBlog(
        obj: { pageNumber?: number, pageSize?: number, sortBy?: string, sortDirection?: string },
        blogId: string,
        userId: string | undefined,
    ): Promise<PostDBPaginationClass> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = obj;
        const skips = pageSize * (pageNumber - 1);
        const sortObj: any = {};
        const totalCount = await PostsModelClass.count({ blogId: blogId });
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        const cursor = await PostsModelClass.find({ blogId: blogId }).sort(sortObj).skip(skips).limit(pageSize);
        const cursorWithCorrectViewModel: PostViewModelClass[]=[]
        cursor.forEach((elem) => {
            const postDBForSpecificBlog = elem as PostDBClass;
            postDBForSpecificBlog.returnUsersLikeStatusForPost(userId);
            cursorWithCorrectViewModel.push(new PostViewModelClass(postDBForSpecificBlog.id,
                postDBForSpecificBlog.title,
                postDBForSpecificBlog.shortDescription,
                postDBForSpecificBlog.content,
                postDBForSpecificBlog.blogId,
                postDBForSpecificBlog.blogName,
                postDBForSpecificBlog.createdAt,
                postDBForSpecificBlog.extendedLikesInfo))
        });
        return new PostDBPaginationClass(
            Math.ceil(totalCount / pageSize),
            pageNumber,
            pageSize,
            totalCount,
            cursorWithCorrectViewModel,
        );
    }
    async getPostById(id: string,userId: string | undefined): Promise<PostViewModelClass | null> {
        const post = await PostsModelClass.findOne({ id: id });
        if (!post) {
            return null
        }
        const postDB = post as PostDBClass;
        postDB.returnUsersLikeStatusForPost(userId);
        return new PostViewModelClass(postDB.id,
            postDB.title,
            postDB.shortDescription,
            postDB.content,
            postDB.blogId,
            postDB.blogName,
            postDB.createdAt,
            postDB.extendedLikesInfo);
    }
    async getPostForIdValidation(id: string): Promise<PostViewModelClass | null> {
        return PostsModelClass.findOne({ id: id }, { _id: 0, usersLikesInfo: 0 })
    }
    async getPostByIdForLikeOperation(id: string): Promise<PostDBClass | null> {
        return  PostsModelClass.findOne({ id: id });
    }
}

















import {
    CommentDBClass,
    CommentDBPaginationClass,
    CommentViewModelClass,
} from "../classes/classes";
import {CommentsModelClass} from "./db";
import {injectable} from "inversify";




@injectable()
export class CommentsQueryRepository {
    async getCommentById(id: string, userId: string | undefined): Promise<CommentViewModelClass | null> {
        const comment = await CommentsModelClass.findOne({ id: id });
        if (!comment) {
            return null
        }
        const commentDb=comment as CommentDBClass
        await commentDb.returnUsersLikeStatusForComment(userId);
        return commentDb.transformToCommentViewModelClass();
    }
    async getAllCommentsForSpecificPost(obj:{pageNumber?:number,pageSize?:number,sortBy?:string,sortDirection?:string},
                                        postId: string,
                                        userId: string | undefined,
    ): Promise<CommentDBPaginationClass> {
        const { pageNumber = 1, pageSize = 10, sortBy = "createdAt", sortDirection = "desc" } = obj
        // Calculate the number of documents to skip based on the page size and number
        const skips = pageSize * (pageNumber - 1);
        // Create an object to store the sort criteria
        const sortObj: any = {};
        if (sortDirection === "desc") {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }
        // Retrieve the documents from the commentsModelClass collection, applying the sort, skip, and limit options
        const cursor = await CommentsModelClass.find({}).sort(sortObj).skip(skips).limit(pageSize);
        const cursorWithCorrectViewModel: CommentViewModelClass[]=[]
        cursor.forEach((elem) => {
            elem.returnUsersLikeStatusForComment(userId);
            cursorWithCorrectViewModel.push(elem.transformToCommentViewModelClass())
        });
        const totalCount = await CommentsModelClass.count({postId: postId})
        return new CommentDBPaginationClass(
            Math.ceil(totalCount / pageSize),
            pageNumber,
            pageSize,
            totalCount,
            cursorWithCorrectViewModel,
        );
    }
    async getCommentByIdForLikeOperation(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({id: id})
    }
    async getCommentForIdValidation(id: string): Promise<CommentDBClass | null> {
        return CommentsModelClass.findOne({id: id})
    }

}



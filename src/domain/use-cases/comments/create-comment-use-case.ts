import {
    CommentDBClass,
    LikesInfoClass,
    CommentViewModelClass,
    UserAccountDBClass,
    UsersLikesInfoClass
} from "../../../types/classes";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../../../repositories/comments-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CreateCommentUseCase {
    constructor(@inject(CommentsRepository) private commentsRepository: CommentsRepository) {}

    async execute(content: string,postId:string, user:UserAccountDBClass): Promise<CommentViewModelClass> {
        const likes: LikesInfoClass= new LikesInfoClass(0,0,"None")
        const usersLikesInfo: UsersLikesInfoClass= new UsersLikesInfoClass([],[])
        const comment:CommentDBClass = new CommentDBClass (new ObjectId(),Number((new Date())).toString() ,content,user.id,user.login,postId,new Date().toISOString(),likes,usersLikesInfo)
        const newComment= await this.commentsRepository.createComment(comment)
        return  (({ id, content, userId, userLogin, createdAt, likesInfo }) => ({id, content, userId, userLogin, createdAt, likesInfo}))(newComment)
    }
}

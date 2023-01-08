import {inject, injectable} from "inversify";
import {CommentsRepository} from "../../../repositories/comments-repository";
import {CommentsQueryRepository} from "../../../repositories/comments-query-repository";


@injectable()
export class UpdateCommentUseCase {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async execute(id: string, content: string,userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsQueryRepository.getCommentById(id,userId)
        if (!comment) {
            return false
        }
        if (userId!==comment.userId) {
            return false
        }
        return this.commentsRepository.updateCommentById(id, content)
    }
}

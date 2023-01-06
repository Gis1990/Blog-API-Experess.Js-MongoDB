import {inject, injectable} from "inversify";
import {PostsRepository} from "../../../repositories/posts-repository";

@injectable()
export class UpdatePostUseCase {
    constructor(@inject(PostsRepository) private postsRepository: PostsRepository) {}

    async execute(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<boolean> {
        return this.postsRepository.updatePost(id, title, shortDescription, content, blogId);
    }
}

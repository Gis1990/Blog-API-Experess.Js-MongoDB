import {PostsRepository} from "../../../repositories/posts-repository";
import {inject, injectable} from "inversify";

@injectable()
export class DeletePostUseCase {
    constructor(@inject(PostsRepository) private postsRepository: PostsRepository) {}

    async execute(id: string): Promise<boolean> {
        return this.postsRepository.deletePostById(id);
    }
}

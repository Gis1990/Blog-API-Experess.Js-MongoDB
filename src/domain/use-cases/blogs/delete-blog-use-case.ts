import {inject, injectable} from "inversify";
import {BlogsRepository} from "../../../repositories/blogs-repository";

@injectable()
export class DeleteBlogUseCase {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

    async execute(id: string): Promise<boolean> {
        return  this.blogsRepository.deleteBlogById(id)
    }
}

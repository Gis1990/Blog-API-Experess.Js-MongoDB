import {inject, injectable} from "inversify";
import {BlogsRepository} from "../../../repositories/blogs-repository";

@injectable()
export class UpdateBlogUseCase {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

    async execute(id: string, name: string, description:string,websiteUrl: string): Promise<boolean> {
        return  this.blogsRepository.updateBlog(id, name,description, websiteUrl)
    }
}

import {BlogDBClass, BlogViewModelClass} from "../../../classes/classes";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {BlogsRepository} from "../../../repositories/blogs-repository";

@injectable()
export class CreateBlogUseCase {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {}

    async execute(name: string,description:string, websiteUrl: string): Promise<BlogViewModelClass> {
        let blog: BlogDBClass = new BlogDBClass (new ObjectId(),Number((new Date())).toString() ,name,description, websiteUrl,new Date())
        return  await this.blogsRepository.createBlog(blog)
    }
}

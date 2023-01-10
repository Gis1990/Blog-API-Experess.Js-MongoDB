import {BlogDBClass, BlogDBClassPagination} from "../classes/classes";
import {BlogsModelClass} from "./db";
import {injectable} from "inversify";

@injectable()
export class BlogsQueryRepository {
    async getAllBlogs(obj:{searchNameTerm?:string|null,pageNumber?:number,pageSize?:number,sortBy?:string,sortDirection?:string }):Promise<BlogDBClassPagination> {
        let {
            searchNameTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = obj;
        pageNumber= Number(pageNumber)
        pageSize=  Number(pageSize)

        // Calculate how many documents to skip based on the page number and page size
        const skips = pageSize * (pageNumber - 1)

        // Create an object to store the sort criteria
        let sortObj:any={}
        // Set the key of the sort object to the sortBy parameter and the value to 1 for ascending or -1 for descending
        sortObj[sortBy] = sortDirection === "desc" ? -1 : 1;

        // Initialize the query object as an empty object
        let query:any = {};
        // If the searchNameTerm parameter is provided, add a regex search condition on the name field to the query object
        if (searchNameTerm) {
            query.name = { $regex: searchNameTerm, $options: "i" };
        }

        // Execute the query using the BlogsModelClass model, applying the sort, skip, limit, and lean options, and assign the result to the cursor variable
        const cursor = await BlogsModelClass.find(query, { _id: 0 }).sort(sortObj).skip(skips).limit(pageSize).lean();
        // Get the total count of documents that match the query and assign it to the totalCount variable
        const totalCount = await BlogsModelClass.count(query);
        // Return a new instance of the BlogDBClassPagination class with the calculated total number of pages, the current page number and size, the total number of documents, and the cursor as arguments
        return new BlogDBClassPagination(Math.ceil(totalCount/pageSize),pageNumber,pageSize,totalCount,cursor)
    }
    async getBlogById(id: string):Promise<BlogDBClass|null>{
        return BlogsModelClass.findOne({ id: id }, { _id:0 } )
    }
}








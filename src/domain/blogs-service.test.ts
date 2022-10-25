import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsService} from "./blogs-service";

describe("integration tests for blogs API Express.js framework Service", () => {

    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri);
    })
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    })

    const blogsRepository = new BlogsRepository();
    const blogsService = new BlogsService(blogsRepository);


    describe("createblog", () => {
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })
        it("should return correct created blogs ", async () => {
            let youtubeUrl = "https://www.youtube.com/"
            let name = "anton"
            const result = await blogsService.createBlog(name, youtubeUrl)
            expect(result.youtubeUrl).toBe(youtubeUrl)
            expect(result.name).toBe(name)
            expect(result.id).toEqual(expect.any(String))
        })
    })
})
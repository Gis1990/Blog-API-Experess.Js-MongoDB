import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {BloggersService} from "./bloggers-service";

describe("integration tests for Bloggers API Express.js framework Service", () => {

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

    const bloggersRepository = new BloggersRepository();
    const bloggersService = new BloggersService(bloggersRepository);


    describe("createBlogger", () => {
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })
        it("should return correct created bloggers ", async () => {
            let youtubeUrl = "https://www.youtube.com/"
            let name = "anton"
            const result = await bloggersService.createBlogger(name, youtubeUrl)
            expect(result.youtubeUrl).toBe(youtubeUrl)
            expect(result.name).toBe(name)
            expect(result.id).toEqual(expect.any(String))
        })
    })
})
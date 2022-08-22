import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../index";
import {createUserForTesting} from "./users-router.test";
import {createBloggerForTesting} from "./bloggers-router.test";
import {BloggersModelClass} from "../repositories/db";




describe('endpoint /posts ',  () => {
    const emptyAllPostsDbReturnData={
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }
    const createPostForTesting = (title:string,shortDescription:string, content:string, bloggerId:string) => {
        return{
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId
        }
    }
    const createOutputPostForTesting= (title:string,shortDescription:string, content:string, bloggerId:string,
                                       bloggerName:string,likesCount:number,dislikesCount:number,newestLikes:[])=> {
        return {
            id: expect.any(String),
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName,
            addedAt: expect.any(String),
            extendedLikesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: expect.any(String),
                newestLikes: newestLikes,
            }
        }
    }
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
    it('1.Should return status 204 (/delete)', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })
    it('2.Should return status 200 and correct body (/get)', async () => {
        const response=await request(app)
            .get('/posts')
            .expect(200)
        expect(response.body).toEqual(emptyAllPostsDbReturnData)
    })
    it('3.Should return status 201 (/post) ', async () => {
        const correctUser = createUserForTesting("postsUser1", "postsUser1@email.test", "postsUser1Password")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUser)
            .expect(201)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body).toEqual({id:response.body.id,login: "postsUser1"})
    })
    it('4.Should return status 201 and correct new post (/post) ', async () => {
        const bloggerName="blNameForPosts"
        const correctBlogger = createBloggerForTesting(bloggerName, "https://www.youtube.com/posts")
        await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogger)
            .expect(201)
        const blogger=await BloggersModelClass.findOne({name: bloggerName})
        const correctNewPost = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", blogger!.id)
        const result=createOutputPostForTesting("postTitle1", "postShortDescription1", "postContent1", blogger!.id,blogger!.name,0,0,[])
        const response=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        expect(response.body).toEqual(result)
        expect(response.body.extendedLikesInfo.myStatus).toBe("None")
    })
    it('5.Should return status 401 (/post) ', async () => {
        const blogger=await BloggersModelClass.findOne({name: "blNameForPosts"})
        const correctNewPost = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", blogger!.id)
        await request(app)
            .post('/posts')
            .send(correctNewPost)
            .expect(401)
    })
    it('6.Should return status 400 (/post) ', async () => {
        const incorrectTitle1=""
        const blogger=await BloggersModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting(incorrectTitle1, "postShortDescription1", "postContent1", blogger!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        const incorrectTitle2="a".repeat(31)
        const incorrectNewPost2 = createPostForTesting(incorrectTitle2, "postShortDescription1", "postContent1", blogger!.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response2.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
    })
    it('7.Should return status 400  (/post) ', async () => {
        const incorrectPostShortDescription1=""
        const blogger=await BloggersModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting("postTitle1", incorrectPostShortDescription1, "postContent1", blogger!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
        const incorrectPostShortDescription2="a".repeat(101)
        const incorrectNewPost2 = createPostForTesting("postTitle1", incorrectPostShortDescription2, "postContent1", blogger!.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response2.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
    })
    it('8.Should return status 400  (/post) ', async () => {
        const incorrectPostContent1=""
        const blogger=await BloggersModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting("postTitle1", "postShortDescription1", incorrectPostContent1, blogger!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectPostContent2="a".repeat(1001)
        const incorrectNewPost2 = createPostForTesting("postTitle1", "postShortDescription1", incorrectPostContent2, blogger!.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectBloggerId=""
        const incorrectNewPost3 = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", incorrectBloggerId)
        const response3=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost3)
            .expect(400)
        expect(response3.body).toEqual({errorsMessages:[{field:"bloggerId","message":expect.any(String)}]})
    })
    it('9.Should return status 400  (/post) ', async () => {
        const incorrectTitle=""
        const incorrectPostShortDescription=""
        const incorrectPostContent=""
        const blogger=await BloggersModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting(incorrectTitle, incorrectPostShortDescription, incorrectPostContent, blogger!.id)
        const response=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response.body.errorsMessages.length).toBe(3)
    })
})
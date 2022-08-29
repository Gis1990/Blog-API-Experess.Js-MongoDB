import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../index";
import {createBloggerForTesting} from "./bloggers-router.test";
import {createOutputCommentForTesting, createPostForTesting} from "./posts-router.test";

describe('endpoint /comments ',  () => {
    let mongoServer: MongoMemoryServer;
    beforeAll( async () => {
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
    it('2.Should return status 204  (/put)', async () => {
        const userLogin1="user2C"
        const userPassword1="user2CPassword"
        const response1=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: userLogin1,
                email: "user2C@email.test",
                password: userPassword1
            })
            .expect(201)
        const userId=response1.body.id
        const response2=await request(app)
            .post('/auth/login')
            .send({"login": userLogin1,"password":userPassword1})
            .expect(200)
        const accessToken1=response2.body.accessToken
        const bloggerName="blNameForCom2"
        const correctBlogger = createBloggerForTesting(bloggerName, "https://www.youtube.com/posts")
        const response3=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogger)
            .expect(201)
        const bloggerId=response3.body.id
        const correctContent="correctContentCorrectContent"
        const incorrectContent=""
        const correctNewPostForComments = createPostForTesting("postTitleC2", "postShortDescriptionC2", "postContentC2", bloggerId)
        const response4=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPostForComments)
            .expect(201)
        const postId=response4.body.id
        const outputComment=createOutputCommentForTesting(correctContent,userId, userLogin1,0,0,"None")
        const response5=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:correctContent})
            .expect(201)
        expect(response5.body).toEqual(outputComment)
        const commentId=response5.body.id
        await request(app)
            .put(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:correctContent})
            .expect(204)
        await request(app)
            .put(`/comments/5`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:correctContent})
            .expect(404)
        await request(app)
            .put(`/comments/${commentId}`)
            .send({content:correctContent})
            .expect(401)
        await request(app)
            .put(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:incorrectContent})
            .expect(400)
        await request(app)
            .get(`/comments/5`)
            .expect(404)
        const response7=await request(app)
            .get(`/comments/${commentId}`)
            .expect(200)
        expect(response7.body).toEqual(outputComment)
        await request(app)
            .delete(`/comments/${commentId}`)
            .expect(401)
        await request(app)
            .delete(`/comments/5`)
            .set('authorization','Bearer '+accessToken1)
            .expect(404)
        const userLogin2="user3C"
        const userPassword2="user3CPassword"
        await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: userLogin2,
                email: "user3C@email.test",
                password: userPassword2
            })
            .expect(201)
        const response8=await request(app)
            .post('/auth/login')
            .send({"login": userLogin2,"password":userPassword2})
            .expect(200)
        const accessToken2=response8.body.accessToken
        await request(app)
            .put(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken2)
            .send({content:correctContent})
            .expect(403)
        await request(app)
            .delete(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken2)
            .expect(403)
        await request(app)
            .delete(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken1)
            .expect(204)
    })
})

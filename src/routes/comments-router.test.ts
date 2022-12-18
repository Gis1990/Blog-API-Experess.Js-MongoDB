import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../index";
import {createUserForTesting} from "./users-router.test";
import {creatingBlogForTests} from "./blogs-router.test";
import {createContentCommentForTesting, createOutputCommentForTesting, createPostForTesting} from "./posts-router.test";




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
        await new Promise(res => setTimeout(res, 10000))
        const correctUser1 = createUserForTesting(6, 2, 10)
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: correctUser1.login,
                email: correctUser1.email,
                password: correctUser1.password,
            })
            .expect(201)
        const userId1=response.body.id
        const response1=await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser1.login,password:correctUser1.password})
            .expect(200)
        const accessToken1=response1.body.accessToken
        const correctBlog = creatingBlogForTests(10, 5,true)
        const response2=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blogId=response2.body.id
        const correctNewPostForComments = createPostForTesting(15, 30, 200,blogId)
        const response3=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPostForComments)
            .expect(201)
        const postId=response3.body.id
        const outputComment1=createOutputCommentForTesting(50,userId1, correctUser1.login,0,0,"None")
        const response4=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:outputComment1.content})
            .expect(201)
        expect(response4.body).toEqual(outputComment1)
        const commentId=response4.body.id
        const updatedCorrectContentForComment=createContentCommentForTesting(50)
        await request(app)
            .put(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:updatedCorrectContentForComment.content})
            .expect(204)
        await request(app)
            .put(`/comments/5`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:updatedCorrectContentForComment.content})
            .expect(404)
        const updatedIncorrectContentForComment=createContentCommentForTesting(0)
        await request(app)
            .put(`/comments/${commentId}`)
            .send({content:updatedCorrectContentForComment.content})
            .expect(401)
        await request(app)
            .put(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:updatedIncorrectContentForComment.content})
            .expect(400)
        await request(app)
            .get(`/comments/5`)
            .expect(404)
        const response5=await request(app)
            .get(`/comments/${commentId}`)
            .expect(200)
        outputComment1.content=updatedCorrectContentForComment.content
        expect(response5.body).toEqual(outputComment1)
        await request(app)
            .delete(`/comments/${commentId}`)
            .expect(401)
        await request(app)
            .delete(`/comments/5`)
            .set('authorization','Bearer '+accessToken1)
            .expect(404)
        await new Promise(res => setTimeout(res, 10000))
        const correctUser2 = createUserForTesting(6, 2, 10)
        await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: correctUser2.login,
                email: correctUser2.email,
                password: correctUser2.password,
            })
            .expect(201)
        const response7=await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser2.login,password:correctUser2.password})
            .expect(200)
        const accessToken2=response7.body.accessToken
        await request(app)
            .put(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken2)
            .send({content:updatedCorrectContentForComment.content})
            .expect(403)
        await request(app)
            .delete(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken2)
            .expect(403)
        await request(app)
            .delete(`/comments/${commentId}`)
            .set('authorization','Bearer '+accessToken1)
            .expect(204)
        const outputComment2=createOutputCommentForTesting(50,userId1, correctUser1.login,0,0,"None")
        const response8=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken1)
            .send({content:outputComment2.content})
            .expect(201)
        expect(response8.body).toEqual(outputComment2)
        const commentId2=response8.body.id
        await request(app)
            .put(`/comments/${commentId2}/like-status`)
            .set('authorization', 'Bearer ' + accessToken1)
            .send({likeStatus: "Like"})
            .expect(204)
        const response9=await request(app)
            .get(`/comments/${commentId2}`)
            .set('authorization', 'Bearer ' + accessToken1)
            .expect(200)
        expect(response9.body.likesInfo.likesCount).toBe(1)
        expect(response9.body.likesInfo.myStatus).toBe("Like")

        const response10=await request(app)
            .get(`/comments/${commentId2}`)
            .expect(200)
        expect(response10.body.likesInfo.likesCount).toBe(1)
        expect(response10.body.likesInfo.myStatus).toBe("None")

        await request(app)
            .put(`/comments/${commentId2}/like-status`)
            .set('authorization', 'Bearer ' + accessToken1)
            .send({likeStatus: "Dislike"})
            .expect(204)
        const response11=await request(app)
            .get(`/comments/${commentId2}`)
            .set('authorization', 'Bearer ' + accessToken1)
            .expect(200)
        expect(response11.body.likesInfo.dislikesCount).toBe(1)
        expect(response11.body.likesInfo.likesCount).toBe(0)
        expect(response11.body.likesInfo.myStatus).toBe("Dislike")
    })
})

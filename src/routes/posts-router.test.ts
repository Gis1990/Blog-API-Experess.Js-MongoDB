import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../index";
import {BlogsModelClass} from "../repositories/db";
import {createUserForTesting} from "./users-router.test";
import {creatingBlogForTests, randomString} from "./blogs-router.test";


export const createPostForTesting = (titleLen:number,shortDescriptionLen:number,contentLen:number, blogId:string) => {
    return{
        title: randomString(titleLen),
        shortDescription: randomString(shortDescriptionLen),
        content: randomString(contentLen),
        blogId: blogId
    }
}

export const createCommentForTesting = (contentLen:number) => {
    return{
        content: randomString(contentLen)
    }
}

export const createOutputCommentForTesting = (contentLen:number,userId:string, userLogin:string,likesCount:number,dislikesCount:number,myStatus:string) => {
    return{
        id: expect.any(String),
        content: randomString(contentLen),
        userId: userId,
        userLogin: userLogin,
        createdAt: expect.any(String),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: myStatus
        }
    }
}





describe('endpoint /posts ',  () => {
    const emptyAllPostsDbReturnData={
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }
    const createOutputPostForTesting= (title:string,shortDescription:string, content:string, blogId:string,
                                       blogName:string,likesCount:number,dislikesCount:number,newestLikes:[])=> {
        return {
            id: expect.any(String),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: expect.any(String),
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
        mongoose.set('strictQuery', false)
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
    it('3.Should return status 201 and correct new post (/post) ', async () => {
        const correctBlog = creatingBlogForTests(10, 5, true);
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blog=await BlogsModelClass.findOne({name: correctBlog.name})
        const correctNewPost1 = createPostForTesting(20, 50, 500, blog?.id)
        const result=createOutputPostForTesting(correctNewPost1.title, correctNewPost1.shortDescription, correctNewPost1.content, blog?.id,correctBlog?.name,0,0,[])
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost1)
            .expect(201)
        expect(response1.body).toEqual(result)
        expect(response1.body.extendedLikesInfo.myStatus).toBe("None")
        // Should return status 401 (/post)
        const correctNewPost2 = createPostForTesting(20, 50, 500, blog?.id)
        await request(app)
            .post('/posts')
            .send(correctNewPost2)
            .expect(401)
        // Should return status 400 (/post)
        const incorrectNewPost1 = createPostForTesting(0, 50, 500, blog?.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response2.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        const incorrectNewPost2 = createPostForTesting(50, 50, 500, blog?.id)
        const response3=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response3.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        const incorrectNewPost3 = createPostForTesting(20, 0, 500, blog?.id)
        const response4=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost3)
            .expect(400)
        expect(response4.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
        const incorrectNewPost4 = createPostForTesting(20, 150, 500, blog?.id)
        const response5=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost4)
            .expect(400)
        expect(response5.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
        const incorrectNewPost5 = createPostForTesting(20, 50, 0, blog?.id)
        const response6=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost5)
            .expect(400)
        expect(response6.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectNewPost6 = createPostForTesting(20, 50, 1200, blog?.id)
        const response7=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost6)
            .expect(400)
        expect(response7.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectNewPost7 = createPostForTesting(20, 50, 300, "1")
        const response8=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost7)
            .expect(400)
        expect(response8.body).toEqual({errorsMessages:[{field:"blogId","message":expect.any(String)}]})
        const incorrectNewPost8 = createPostForTesting(0, 0, 0, blog!.id)
        const response9=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost8)
            .expect(400)
        expect(response9.body.errorsMessages.length).toBe(3)
    })
    it('4.Should return status 201  (/post) ', async () => {
        const correctUser = createUserForTesting(5, 2, 10)
        const response1=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: correctUser.login,
                email: correctUser.email,
                password: correctUser.password,
            })
            .expect(201)
        const userId=response1.body.id
        const response2=await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser.login,password:correctUser.password})
            .expect(200)
        const accessToken=response2.body.accessToken
        const correctBlog = creatingBlogForTests(10, 5,true)
        const response3=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blogId=response3.body.id
        const correctNewPostForComments = createPostForTesting(15, 30, 200,blogId)
        const response4=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPostForComments)
            .expect(201)
        const postId=response4.body.id
        const outputComment=createOutputCommentForTesting(50,userId, correctUser.login,0,0,"None")
        const response5=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:outputComment.content})
            .expect(201)
        expect(response5.body).toEqual(outputComment)
        await request(app)
            .post(`/posts/${postId}/comments`)
            .send({content:outputComment.content})
            .expect(401)
        await request(app)
            .post(`/posts/5/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:outputComment.content})
            .expect(404)
        const incorrectContent1=createCommentForTesting(0)
        const response6=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:incorrectContent1})
            .expect(400)
        expect(response6.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectContent2=createCommentForTesting(350)
        const response7=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:incorrectContent2})
            .expect(400)
        expect(response7.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        await request(app)
            .get(`/posts/8/comments`)
            .expect(404)
        const response8=await request(app)
            .get(`/posts/${postId}/comments`)
            .expect(200)
        expect(response8.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items:[outputComment]
        })
    })
    it('5.Should return status 204 (/delete)', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })
    it('6.Should return status 201 and correct new post (/get) ', async () => {
        const correctBlog = creatingBlogForTests(10, 5, true);
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blog=await BlogsModelClass.findOne({name: correctBlog.name})
        const correctNewPost = createPostForTesting(20, 50, 500, blog?.id)
        const result=createOutputPostForTesting(correctNewPost.title, correctNewPost.shortDescription, correctNewPost.content, blog?.id,correctBlog?.name,0,0,[])
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        const postId=response1.body.id
        await request(app)
            .get(`/posts/5`)
            .expect(404)
        const response2=await request(app)
            .get(`/posts/${postId}`)
            .expect(200)
        expect(response2.body).toEqual(result)
        // Should return status 204  (/put)
        const correctDataForUpdating=createPostForTesting(20, 50, 500, blog?.id)
        await request(app)
            .put(`/posts/5`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
        await request(app)
            .put(`/posts/${postId}`)
            .send(correctDataForUpdating)
            .expect(401)
        await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctDataForUpdating)
            .expect(204)
        const incorrectDataForUpdating1=createPostForTesting(0, 50, 500, blog?.id)
        const response3=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating1)
            .expect(400)
        expect(response3.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        const incorrectDataForUpdating2=createPostForTesting(40, 50, 500, blog?.id)
        const response4=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating2)
            .expect(400)
        expect(response4.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        // Should return status 204 and delete posts (/delete)
        await request(app)
            .delete(`/posts/${postId}`)
            .expect(401)
        await request(app)
            .delete(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)
        await request(app)
            .delete(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
        await request(app)
            .delete(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
    })
    it('7.Should return status 204 (/delete)', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })

    it('14.Should return status 204 and change like status (/put) ', async () => {
        const correctUser2 = createUserForTesting(5, 2, 10)
        const response1 = await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: correctUser2.login,
                email: correctUser2.email,
                password: correctUser2.password,
            })
            .expect(201)
        const userId = response1.body.id
        const response2 = await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser2.login, password: correctUser2.password})
            .expect(200)
        const accessToken2 = response2.body.accessToken
        const correctBlog = creatingBlogForTests(10, 5, true)
        const response3 = await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blogId = response3.body.id
        const correctNewPost = createPostForTesting(15, 30, 200, blogId)
        const response4 = await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        const postId = response4.body.id
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .send({likeStatus: "Like"})
            .expect(401)
        await request(app)
            .put(`/posts/5/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "Like"})
            .expect(404)
        const response5 = await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "Incorrect"})
            .expect(400)
        expect(response5.body).toEqual({errorsMessages: [{field: "likeStatus", "message": expect.any(String)}]})
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "Like"})
            .expect(204)
        const response6 = await request(app)
            .get(`/posts/${postId}`)
            .expect(200)
        expect(response6.body.extendedLikesInfo.likesCount).toBe(1)
        expect(response6.body.extendedLikesInfo.myStatus).toBe("None")
        const response7 = await request(app)
            .get(`/posts/${postId}`)
            .set('authorization', 'Bearer ' + accessToken2)
            .expect(200)
        expect(response7.body.extendedLikesInfo.likesCount).toBe(1)
        expect(response7.body.extendedLikesInfo.myStatus).toBe("Like")
        expect(response7.body.extendedLikesInfo.newestLikes.length).toBe(1)
        expect(response7.body.extendedLikesInfo.newestLikes[0].login).toBe(correctUser2.login)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "Dislike"})
            .expect(204)
        const response8 = await request(app)
            .get(`/posts/${postId}`)
            .set('authorization', 'Bearer ' + accessToken2)
            .expect(200)
        expect(response8.body.extendedLikesInfo.likesCount).toBe(0)
        expect(response8.body.extendedLikesInfo.dislikesCount).toBe(1)
        expect(response8.body.extendedLikesInfo.myStatus).toBe("Dislike")
        expect(response8.body.extendedLikesInfo.newestLikes.length).toBe(0)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "None"})
            .expect(204)
        const response9 = await request(app)
            .get(`/posts/${postId}`)
            .set('authorization', 'Bearer ' + accessToken2)
            .expect(200)
        expect(response9.body.extendedLikesInfo.likesCount).toBe(0)
        expect(response9.body.extendedLikesInfo.dislikesCount).toBe(0)
        expect(response9.body.extendedLikesInfo.myStatus).toBe("None")
        expect(response9.body.extendedLikesInfo.newestLikes.length).toBe(0)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "Dislike"})
            .expect(204)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken2)
            .send({likeStatus: "Like"})
            .expect(204)
        const response10 = await request(app)
            .get(`/posts/${postId}`)
            .set('authorization', 'Bearer ' + accessToken2)
            .expect(200)
        expect(response10.body.extendedLikesInfo.likesCount).toBe(1)
        expect(response10.body.extendedLikesInfo.myStatus).toBe("Like")
        expect(response10.body.extendedLikesInfo.newestLikes.length).toBe(1)
        expect(response10.body.extendedLikesInfo.newestLikes[0].login).toBe(correctUser2.login)
    })
    it('15.Should return status 204 and change like status', async () => {
        const users = [createUserForTesting(5, 2, 10), createUserForTesting(5, 2, 10), createUserForTesting(5, 2, 10), createUserForTesting(5, 2, 10)];
        const accessTokens = [];
        const userIds = [];
        for (const user of users) {
            const response1 = await request(app)
                .post('/users')
                .set('authorization', 'Basic YWRtaW46cXdlcnR5')
                .send({
                    login: user.login,
                    email: user.email,
                    password: user.password,
                })
                .expect(201);
            userIds.push(response1.body.id)
            const response2 = await request(app)
                .post('/auth/login')
                .send({ loginOrEmail: user.login, password: user.password })
                .expect(200);
            accessTokens.push(response2.body.accessToken);
        }
        const correctBlog = creatingBlogForTests(10, 5, true)
        const response1 = await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blogId = response1.body.id
        const correctNewPost = createPostForTesting(15, 30, 200, blogId)
        const response2 = await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        const postId = response2.body.id
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessTokens[3])
            .send({likeStatus: "Like"})
            .expect(204)
        const response3 = await request(app)
            .get(`/posts/${postId}`)
            .set('authorization', 'Bearer ' + accessTokens[3])
            .expect(200)
        expect(response3.body.extendedLikesInfo.likesCount).toBe(1)
        expect(response3.body.extendedLikesInfo.myStatus).toBe("Like")
        expect(response3.body.extendedLikesInfo.newestLikes.length).toBe(1)
        expect(response3.body.extendedLikesInfo.newestLikes[0].login).toBe(users[3].login)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization', 'Bearer ' + accessTokens[2])
            .send({likeStatus: "Like"})
            .expect(204)
        const response4 = await request(app)
            .get(`/posts/${postId}`)
            .set('authorization', 'Bearer ' + accessTokens[3])
            .expect(200)
        expect(response4.body.extendedLikesInfo.likesCount).toBe(2)
        expect(response4.body.extendedLikesInfo.myStatus).toBe("Like")
        expect(response4.body.extendedLikesInfo.newestLikes.length).toBe(2)
        expect(response4.body.extendedLikesInfo.newestLikes[0].login).toBe(users[2].login)

    });
})

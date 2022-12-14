import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../index";
import {BlogsModelClass} from "../repositories/db";
import {createUserForTesting} from "./users-router.test";
import {createBlogForTesting} from "./blogs-router.test";


export const createPostForTesting = (title:string,shortDescription:string, content:string, blogId:string) => {
    return{
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId
    }
}

export const createOutputCommentForTesting = (content:string,userId:string, userLogin:string,likesCount:number,dislikesCount:number,myStatus:string) => {
    return{
        id: expect.any(String),
        content: content,
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
        expect(response.body.createdAt).toEqual(expect.any(String))
        expect(response.body).toEqual({id:response.body.id,login: "postsUser1",email:"postsUser1@email.test",createdAt:response.body.createdAt})
    })
    it('4.Should return status 201 and correct new post (/post) ', async () => {
        const blogName="blNameForPosts"
        const correctBlog = createBlogForTesting(blogName, "https://www.youtube.com/posts")
        await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog)
            .expect(201)
        const blog=await BlogsModelClass.findOne({name: blogName})
        const correctNewPost = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", blog!.id)
        const result=createOutputPostForTesting("postTitle1", "postShortDescription1", "postContent1", blog!.id,blog!.name,0,0,[])
        const response=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        expect(response.body).toEqual(result)
        expect(response.body.extendedLikesInfo.myStatus).toBe("None")
    })
    it('5.Should return status 401 (/post) ', async () => {
        const blog=await BlogsModelClass.findOne({name: "blNameForPosts"})
        const correctNewPost = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", blog!.id)
        await request(app)
            .post('/posts')
            .send(correctNewPost)
            .expect(401)
    })
    it('6.Should return status 400 (/post) ', async () => {
        const incorrectTitle1=""
        const blog=await BlogsModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting(incorrectTitle1, "postShortDescription1", "postContent1", blog!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        const incorrectTitle2="a".repeat(31)
        const incorrectNewPost2 = createPostForTesting(incorrectTitle2, "postShortDescription1", "postContent1", blog!.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response2.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
    })
    it('7.Should return status 400  (/post) ', async () => {
        const incorrectPostShortDescription1=""
        const blog=await BlogsModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting("postTitle1", incorrectPostShortDescription1, "postContent1", blog!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
        const incorrectPostShortDescription2="a".repeat(101)
        const incorrectNewPost2 = createPostForTesting("postTitle1", incorrectPostShortDescription2, "postContent1", blog!.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response2.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
    })
    it('8.Should return status 400  (/post) ', async () => {
        const incorrectPostContent1=""
        const blog=await BlogsModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting("postTitle1", "postShortDescription1", incorrectPostContent1, blog!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectPostContent2="a".repeat(1001)
        const incorrectNewPost2 = createPostForTesting("postTitle1", "postShortDescription1", incorrectPostContent2, blog!.id)
        await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost2)
            .expect(400)
        expect(response1.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectblogId=""
        const incorrectNewPost3 = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", incorrectblogId)
        const response3=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost3)
            .expect(400)
        expect(response3.body).toEqual({errorsMessages:[{field:"blogId","message":expect.any(String)}]})
    })
    it('9.Should return status 400  (/post) ', async () => {
        const incorrectTitle=""
        const incorrectPostShortDescription=""
        const incorrectPostContent=""
        const blog=await BlogsModelClass.findOne({name: "blNameForPosts"})
        const incorrectNewPost1 = createPostForTesting(incorrectTitle, incorrectPostShortDescription, incorrectPostContent, blog!.id)
        const response=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectNewPost1)
            .expect(400)
        expect(response.body.errorsMessages.length).toBe(3)
    })
    it('10.Should return status 201  (/post) ', async () => {
        const userLogin="user1C"
        const userPassword="user1CPassword"
        const response1=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({
                login: userLogin,
                email: "user1C@email.test",
                password: userPassword
            })
            .expect(201)
        const userId=response1.body.id
        const response2=await request(app)
            .post('/auth/login')
            .send({"login": userLogin,"password":userPassword})
            .expect(200)
        const accessToken=response2.body.accessToken
        const blogName="blNameForCom"
        const correctblog = createBlogForTesting(blogName, "https://www.youtube.com/posts")
        const response3=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctblog)
            .expect(201)
        const blogId=response3.body.id
        const correctContent="correctContentCorrectContent"
        const correctNewPostForComments = createPostForTesting("postTitleC", "postShortDescriptionC", "postContentC", blogId)
        const response4=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPostForComments)
            .expect(201)
        const postId=response4.body.id
        const outputComment=createOutputCommentForTesting(correctContent,userId, userLogin,0,0,"None")
        const response5=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:correctContent})
            .expect(201)
        expect(response5.body).toEqual(outputComment)
        await request(app)
            .post(`/posts/${postId}/comments`)
            .send({content:correctContent})
            .expect(401)
        await request(app)
            .post(`/posts/5/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:correctContent})
            .expect(404)
        const incorrectContent1=""
        const response6=await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization','Bearer '+accessToken)
            .send({content:incorrectContent1})
            .expect(400)
        expect(response6.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectContent2="a".repeat(301)
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
    it('11.Should return status 201 and correct new post (/get) ', async () => {
        const blogName="blNameForPosts"
        const blog=await BlogsModelClass.findOne({name: blogName})
        const correctNewPost2 = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", blog!.id)
        const result=createOutputPostForTesting("postTitle1", "postShortDescription1", "postContent1", blog!.id,blog!.name,0,0,[])
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost2)
            .expect(201)
        const postId=response1.body.id
        await request(app)
            .get(`/posts/5`)
            .expect(404)
        const response2=await request(app)
            .get(`/posts/${postId}`)
            .expect(200)
        expect(response2.body).toEqual(result)
    })
    it('12.Should return status 204  (/put) ', async () => {
        const blogName="blNameForPosts"
        const blog=await BlogsModelClass.findOne({name: blogName})
        const correctNewPost3 = createPostForTesting("postTitle1", "postShortDescription1", "postContent1", blog!.id)
        const correctDataForUpdating=createPostForTesting("updatedPostTitle1", "updatedPostShortDescription1", "updatedPostContent1", blog!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost3)
            .expect(201)
        const postId=response1.body.id
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
        const incorrectTitleForUpdating=""
        const incorrectDataForUpdating1=createPostForTesting(incorrectTitleForUpdating, "updatedPostShortDescription1", "updatedPostContent1", blog!.id)
        const response2=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating1)
            .expect(400)
        expect(response2.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
        const incorrectPostShortDescription="a".repeat(101)
        const incorrectDataForUpdating2=createPostForTesting("updatedPostTitle1", incorrectPostShortDescription, "updatedPostContent1", blog!.id)
        const response3=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating2)
            .expect(400)
        expect(response3.body).toEqual({errorsMessages:[{field:"shortDescription","message":expect.any(String)}]})
        const incorrectPostContent="a".repeat(1001)
        const incorrectDataForUpdating3=createPostForTesting("updatedPostTitle1", "updatedPostShortDescription1", incorrectPostContent, blog!.id)
        const response4=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating3)
            .expect(400)
        expect(response4.body).toEqual({errorsMessages:[{field:"content","message":expect.any(String)}]})
        const incorrectblogId="5"
        const incorrectDataForUpdating4=createPostForTesting("updatedPostTitle1", "updatedPostShortDescription1", "updatedPostContent1", incorrectblogId)
        const response5=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating4)
            .expect(400)
        expect(response5.body).toEqual({errorsMessages:[{field:"blogId","message":expect.any(String)}]})
        const incorrectDataForUpdating5=createPostForTesting("updatedPostTitle1", incorrectPostShortDescription, incorrectPostContent, incorrectblogId)
        const response6=await request(app)
            .put(`/posts/${postId}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectDataForUpdating5)
            .expect(400)
        expect(response6.body.errorsMessages.length).toBe(3)
    })
    it('13.Should return status 204 and delete posts (/delete) ', async () => {
        const blogName="blNameForPosts"
        const blog=await BlogsModelClass.findOne({name: blogName})
        const correctNewPost = createPostForTesting("postTitleDel", "postTitleDel", "postTitleDel", blog!.id)
        const response1=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        const postId=response1.body.id
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
    it('14.Should return status 204 and change like status (/put) ', async () => {
        const blogName="blNameForPosts"
        const userLogin="user1C"
        const userPassword="user1CPassword"
        const response1=await request(app)
            .post('/auth/login')
            .send({"login": userLogin,"password":userPassword})
            .expect(200)
        const accessToken=response1.body.accessToken
        const blog=await BlogsModelClass.findOne({name: blogName})
        const correctNewPost = createPostForTesting("postTitleLike", "postTitleLike", "postTitleLike", blog!.id)
        const response2=await request(app)
            .post('/posts')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctNewPost)
            .expect(201)
        const postId=response2.body.id
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .send({likeStatus: "Like"})
            .expect(401)
        await request(app)
            .put(`/posts/5/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "Like"})
            .expect(404)
        const response3=await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "Incorrect"})
            .expect(400)
        expect(response3.body).toEqual({errorsMessages:[{field:"likeStatus","message":expect.any(String)}]})
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "Like"})
            .expect(204)
        const response4=await request(app)
            .get(`/posts/${postId}`)
            .expect(200)
        expect(response4.body. extendedLikesInfo.likesCount).toBe(1)
        expect(response4.body. extendedLikesInfo.myStatus).toBe("None")
        const response5=await request(app)
            .get(`/posts/${postId}`)
            .set('authorization','Bearer '+accessToken)
            .expect(200)
        expect(response5.body.extendedLikesInfo.likesCount).toBe(1)
        expect(response5.body.extendedLikesInfo.myStatus).toBe("Like")
        expect(response5.body.extendedLikesInfo.newestLikes.length).toBe(1)
        expect(response5.body.extendedLikesInfo.newestLikes[0].login).toBe(userLogin)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "Dislike"})
            .expect(204)
        const response6=await request(app)
            .get(`/posts/${postId}`)
            .set('authorization','Bearer '+accessToken)
            .expect(200)
        expect(response6.body. extendedLikesInfo.likesCount).toBe(0)
        expect(response6.body. extendedLikesInfo.dislikesCount).toBe(1)
        expect(response6.body.extendedLikesInfo.myStatus).toBe("Dislike")
        expect(response6.body.extendedLikesInfo.newestLikes.length).toBe(0)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "None"})
            .expect(204)
        const response7=await request(app)
            .get(`/posts/${postId}`)
            .set('authorization','Bearer '+accessToken)
            .expect(200)
        expect(response7.body. extendedLikesInfo.likesCount).toBe(0)
        expect(response7.body. extendedLikesInfo.dislikesCount).toBe(0)
        expect(response7.body. extendedLikesInfo.myStatus).toBe("None")
        expect(response7.body.extendedLikesInfo.newestLikes.length).toBe(0)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "Dislike"})
            .expect(204)
        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('authorization','Bearer '+accessToken)
            .send({likeStatus: "Like"})
            .expect(204)
        const response8=await request(app)
            .get(`/posts/${postId}`)
            .set('authorization','Bearer '+accessToken)
            .expect(200)
        expect(response8.body.extendedLikesInfo.likesCount).toBe(1)
        expect(response8.body.extendedLikesInfo.myStatus).toBe("Like")
        expect(response8.body.extendedLikesInfo.newestLikes.length).toBe(1)
        expect(response8.body.extendedLikesInfo.newestLikes[0].login).toBe(userLogin)

    })

})

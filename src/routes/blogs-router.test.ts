import request from 'supertest'
import {app} from "../index";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {BlogsModelClass} from "../repositories/db";

export const createBlogForTesting = (name:string,description:string, websiteUrl:string) => {
    return{
        name: name,
        description: description,
        websiteUrl: websiteUrl
    }
}



describe('endpoint / ',  () => {
    it('Should return status 200 and string Hello!', async () => {
        await request(app)
            .get('/')
            .expect(200,"Hello!")
    })
})



describe('endpoint /blogs ',  () => {
    const emptyAllBlogsDbReturnData={
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }
    const createPostForTestingInBlogs = (title:string,shortDescription:string,content:string,blogId:string) => {
        return{
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId:blogId
        }

    }
    const createDbReturnDataForAllBlogs = (pagesCount:number,page:number,pageSize:number,totalCount:number,blogs:object) => {
        return{
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: [blogs]
        }
    }
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
    it('2.Should return status 200 and correct body (/get)', async () => {
        const response=await request(app)
            .get('/blogs')
            .expect(200)
        expect(response.body).toEqual(emptyAllBlogsDbReturnData)
    })
    it('3.Should return status 401 (/post) ', async () => {
        const correctBlog = createBlogForTesting("testName", "correct description","https://www.youtube.com/test")
        await request(app)
            .post('/blogs')
            .send(correctBlog)
            .expect(401)

    })
    it('4.Should return status 400 and array with error in websiteUrl (/post)', async () => {
        const blogName="testName"
        const correctDescription="correct description"
        const incorrectBlogWebsiteUrl="http://www.youtube.com/test"
        const notCorrectBlog = createBlogForTesting(blogName,correctDescription,incorrectBlogWebsiteUrl)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlog)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"websiteUrl","message":expect.any(String)}]})
    })
    it('5.Should return status 400 and array with errors in name and websiteUrl (/post)', async () => {
        const incorrectBlogName="testName111111111111111111111111"
        const correctDescription1="correct description"
        const incorrectBlogWebsiteUrl="http://www.youtube.com/test"
        const notCorrectBlog = createBlogForTesting(incorrectBlogName,correctDescription1, incorrectBlogWebsiteUrl)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlog)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)},{field:"websiteUrl","message":expect.any(String)}]})
    })
    it('6.Should return status 400 and array with error in name (/post)', async () => {
        const incorrectBlogName="testName111111111111111111111111"
        const correctDescription="correct description"
        const correctBlogWebsiteUrl="https://www.youtube.com/test"
        const notCorrectBlog = createBlogForTesting(incorrectBlogName,correctDescription, correctBlogWebsiteUrl)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlog)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)}]})
    })
    it('7.Should return status 400 and array with error in name (/post)', async () => {
        const incorrectBlogName=""
        const correctDescription2="correct description"
        const correctBlogWebsiteUrl="https://www.youtube.com/test"
        const notCorrectBlog = createBlogForTesting(incorrectBlogName,correctDescription2, correctBlogWebsiteUrl)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlog)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)}]})
    })
    it('8.Should return status 400 and array with errors in name and websiteUrl (/post)', async () => {
        const incorrectBlogName=""
        const incorrectBlogWebsiteUrl=""
        const correctDescription3="correct description"
        const notCorrectBlog = createBlogForTesting(incorrectBlogName,correctDescription3, incorrectBlogWebsiteUrl)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlog)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)},{field:"websiteUrl","message":expect.any(String)}]})
    })
    it('9.Should return status 201 and newly created blog (/post)', async () => {
        const blogName1="testName1"
        const blogWebsiteUrl1="https://www.youtube.com/test1"
        const correctDescription4="correct description"
        const correctBlog1 = createBlogForTesting(blogName1,correctDescription4, blogWebsiteUrl1)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog1)
            .expect(201)
        expect(response.body).toEqual({
            id: response.body.id,
            description: correctDescription4,
            name: blogName1,
            websiteUrl: blogWebsiteUrl1,
            createdAt: response.body.createdAt,
        })
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body.createdAt).toEqual(expect.any(String))

    })
    it('10.Should return status 200 and correct blog (/get)', async () => {
        const blogName1="testName1"
        const correctDescription5="correct description"
        const blogWebsiteUrl1="https://www.youtube.com/test1"
        const response=await request(app)
            .get('/blogs')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body.items[0].createdAt).toEqual(expect.any(String))
        expect(response.body).toEqual(createDbReturnDataForAllBlogs(1,1,10,1,
            { id: response.body.items[0].id,
            name: blogName1,
            description: correctDescription5,
            websiteUrl: blogWebsiteUrl1,
            createdAt: response.body.items[0].createdAt}))
    })
    it('11.Should return status 201 and newly created blog (/post)', async () => {
        const blogName2="testName2"
        const correctDescription5="correct description"
        const blogWebsiteUrl2="https://www.youtube.com/test2"
        const correctBlog2 = createBlogForTesting(blogName2,correctDescription5, blogWebsiteUrl2)
        const response=await request(app)
            .post('/blogs')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlog2 )
            .expect(201)
        expect(response.body).toEqual({
            id: response.body.id,
            name: blogName2,
            description: correctDescription5,
            websiteUrl: blogWebsiteUrl2,
            createdAt: response.body.createdAt
        })
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body.createdAt).toEqual(expect.any(String))

    })
    it('12.Should return status 200 and correct blogs (/get)', async () => {
        const blogName1="testName1"
        const blogWebsiteUrl1="https://www.youtube.com/test1"
        const blogName2="testName2"
        const blogWebsiteUrl2="https://www.youtube.com/test2"
        const correctDescription="correct description"
        const response=await request(app)
            .get('/blogs')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body.items[1].id).toEqual(expect.any(String))
        expect(response.body.items[0].createdAt).toEqual(expect.any(String))
        expect(response.body.items[1].createdAt).toEqual(expect.any(String))
        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [{
                id: response.body.items[0].id,
                name: blogName2,
                description: correctDescription,
                websiteUrl: blogWebsiteUrl2,
                createdAt: response.body.items[0].createdAt
            },{
                id: response.body.items[1].id,
                name: blogName1,
                description: correctDescription,
                websiteUrl: blogWebsiteUrl1,
                createdAt: response.body.items[1].createdAt
            }]
        })
    })
    it('13.Should return status 200,correct blog and correct pagination (/get)', async () => {
        const blogName2="testName2"
        const blogWebsiteUrl2="https://www.youtube.com/test2"
        const correctDescription="correct description"
        const response=await request(app)
            .get('/blogs?pageNumber=1&pageSize=1')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body.items[0].createdAt).toEqual(expect.any(String))
        expect(response.body).toEqual(createDbReturnDataForAllBlogs(2,1,1,2,
            { id: response.body.items[0].id,
                name: blogName2,
                description: correctDescription,
                websiteUrl: blogWebsiteUrl2,
                createdAt: response.body.items[0].createdAt}))
    })
    it('14.Should return status 200,correct blog and correct pagination (/get)', async () => {
        const blogName1="testName1"
        const blogWebsiteUrl1="https://www.youtube.com/test1"
        const correctDescription="correct description"
        const response=await request(app)
            .get('/blogs?pageNumber=2&pageSize=1')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body).toEqual(createDbReturnDataForAllBlogs(2,2,1,2,
            { id: response.body.items[0].id,
                name: blogName1,
                description: correctDescription,
                websiteUrl: blogWebsiteUrl1,
                createdAt: response.body.items[0].createdAt}))
    })
    it('15. return status 200 and correct blog by Id (/get)', async () => {
        const blogName1="testName1"
        const correctDescription1="correct description"
        const blog=await BlogsModelClass.findOne({name: blogName1})
        const blogWebsiteUrl1="https://www.youtube.com/test1"
        const response=await request(app)
            .get(`/blogs/${blog!.id}`)
            .expect(200)
        expect(response.body.createdAt).toEqual(expect.any(String))
        expect(blog!.id).toEqual(expect.any(String))
        expect(response.body).toEqual(
            { id: blog!.id,
                name: blogName1,
                description: correctDescription1,
                websiteUrl: blogWebsiteUrl1,
                createdAt: response.body.createdAt})
    })
    it('16.Should return status 404 with incorrect Id (/get)', async () => {
        await request(app)
            .get(`/blogs/5`)
            .expect(404)

    })
    it('17.Should return status 401 (/put) ', async () => {
        const correctBlog = createBlogForTesting("testName","correct description", "https://www.youtube.com/test")
        const response1= await request(app)
            .get('/blogs')
        await request(app)
            .put(`/blogs/${response1.body.items[0].id}`)
            .send(correctBlog)
            .expect(401)

    })
    it('18.Should return status 404 with incorrect Id (/put)', async () => {
        await request(app)
            .put(`/blogs/5`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

    })
    it('19.Should return status 204 and updated blog (/put) ', async () => {
        const oldBlogName1="testName1"
        const oldDescription1="correct description"
        const newBlogName1="newTestName1"
        const blog=await BlogsModelClass.findOne({name: oldBlogName1})
        const newBlogWebsiteUrl1="https://www.youtube.com/test1new"
        await request(app)
            .put(`/blogs/${blog!.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: newBlogName1,description:oldDescription1, websiteUrl: newBlogWebsiteUrl1})
            .expect(204)
        const response=await request(app)
            .get(`/blogs/${blog!.id}`)
            .expect(200)
        expect(response.body.name).toBe(newBlogName1)
        expect(response.body.websiteUrl).toBe(newBlogWebsiteUrl1)
        expect(response.body.description).toBe(oldDescription1)

    })
    it('20.Should return status 400 and and array with error in name (/put) ', async () => {
        const oldBlogName1="newTestName1"
        const oldDescription1="correct description"
        const newBlogName1="newTestName11111111111111111111111111"
        const blog=await BlogsModelClass.findOne({name: oldBlogName1})
        const newBlogWebsiteUrl1="https://www.youtube.com/test1new"
        const response=await request(app)
            .put(`/blogs/${blog!.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: newBlogName1,description:oldDescription1, websiteUrl: newBlogWebsiteUrl1})
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)}]})
    })
    it('21.Should return status 200 and correct blogs (/delete)', async () => {
        const newBlogName1="newTestName1"
        const blog=await BlogsModelClass.findOne({name: newBlogName1})
        await request(app)
            .delete(`/blogs/${blog!.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)
        const response=await request(app)
            .get('/blogs')
            .expect(200)
        expect(response.body.items.length).toBe(1)
    })
    it('22.Should return status 401 (/delete)', async () => {
        const blogName2="testName2"
        const blog=await BlogsModelClass.findOne({name: blogName2})
        await request(app)
            .delete(`/blogs/${blog!.id}`)
            .expect(401)
    })
    it('23.Should return status 404 for non existing id (/delete)', async () => {
        await request(app)
            .delete(`/blogs/5`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
    })
    it('24.Should return status 201 and a new post for specific blog (/post)', async () => {
        const blogName2="testName2"
        const title="testTitle"
        const shortDescription="testShortDescription"
        const content="testContent"
        const blog=await BlogsModelClass.findOne({"items.name": blogName2})
        const newPost=createPostForTestingInBlogs(title, shortDescription, content,blog!.id)
        const response=await request(app)
            .post(`/blogs/${blog!.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
            .expect(201)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body).toEqual({
            id: response.body.id,
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: `${blog!.id}`,
            blogName: blogName2,
            createdAt: response.body.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }
        })
    })
    it('25.Should return status 400 and array with error (/post) ', async () => {
        const blogName2="testName2"
        const title=""
        const shortDescription="testShortDescription"
        const blog=await BlogsModelClass.findOne({"items.name": blogName2})
        const content="testContent"
        const newPost=createPostForTestingInBlogs(title, shortDescription, content,blog!.id)
        const response=await request(app)
            .post(`/blogs/${blog!.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
    })
    it('26.Should return status 400 and array of errors ', async () => {
        const blogName2="testName2"
        const title=""
        const shortDescription=""
        const content="testContent"
        const blog=await BlogsModelClass.findOne({"items.name": blogName2})
        const newPost=createPostForTestingInBlogs(title, shortDescription, content,blog!.id)
        const response=await request(app)
            .post(`/blogs/${blog!.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)},{field:"shortDescription","message":expect.any(String)}]})
    })
    it('27.Should return status 401 (/post) ', async () => {
        const blogName2="testName2"
        const title="testTitle"
        const shortDescription=""
        const blog=await BlogsModelClass.findOne({"items.name": blogName2})
        const content="testContent"
        const newPost=createPostForTestingInBlogs(title, shortDescription, content,blog!.id)
        await request(app)
            .post(`/blogs/${blog!.id}/posts`)
            .send(newPost)
            .expect(401)
    })
    it('28.Should return status 404 (/get) ', async () => {
        await request(app)
            .get(`/blogs/5/posts`)
            .expect(404)
    })
    it('29.Should return status 200 (/get) ', async () => {
        const blogName2="testName2"
        const title="testTitle"
        const shortDescription="testShortDescription"
        const content="testContent"
        const blog=await BlogsModelClass.findOne({"items.name": blogName2})
        const response=await request(app)
            .get(`/blogs/${blog!.id}/posts`)
            .expect(200)
        expect(response.body).toEqual({
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [
                {
                    "id": response.body.items[0].id,
                    "title": title,
                    "shortDescription": shortDescription,
                    "content": content,
                    "blogId": `${blog!.id}`,
                    "blogName": blogName2,
                    "createdAt": response.body.items[0].createdAt,
                    "extendedLikesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None",
                        "newestLikes": []
                    }
                }
            ]
        })
    })
})








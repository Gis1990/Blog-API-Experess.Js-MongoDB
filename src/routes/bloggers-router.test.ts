import request from 'supertest'
import {app} from "../index";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {BloggersModelClass} from "../repositories/db";

export const createBloggerForTesting = (name:string,youtubeUrl:string) => {
    return{
        name: name,
        youtubeUrl: youtubeUrl
    }
}



describe('endpoint / ',  () => {
    it('Should return status 200 and string Hello!', async () => {
        await request(app)
            .get('/')
            .expect(200,"Hello!")
    })
})



describe('endpoint /bloggers ',  () => {
    const emptyAllBloggersDbReturnData={
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }
    const createPostForTestingInBloggers = (title:string,shortDescription:string,content:string) => {
        return{
            title: title,
            shortDescription: shortDescription,
            content: content
        }
    }
    const createDbReturnDataForAllBloggers = (pagesCount:number,page:number,pageSize:number,totalCount:number,bloggers:object) => {
        return{
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: [bloggers]
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
            .get('/bloggers')
            .expect(200)
        expect(response.body).toEqual(emptyAllBloggersDbReturnData)
    })
    it('3.Should return status 401 (/post) ', async () => {
        const correctBlogger = createBloggerForTesting("testName", "https://www.youtube.com/test")
        await request(app)
            .post('/bloggers')
            .send(correctBlogger)
            .expect(401)

    })
    it('4.Should return status 400 and array with error in youtubeUrl (/post)', async () => {
        const bloggerName="testName"
        const incorrectBloggerYoutubeUrl="http://www.youtube.com/test"
        const notCorrectBlogger = createBloggerForTesting(bloggerName, incorrectBloggerYoutubeUrl)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlogger)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"youtubeUrl","message":expect.any(String)}]})
    })
    it('5.Should return status 400 and array with errors in name and youtubeUrl (/post)', async () => {
        const incorrectBloggerName="testName111111111111111111111111"
        const incorrectBloggerYoutubeUrl="http://www.youtube.com/test"
        const notCorrectBlogger = createBloggerForTesting(incorrectBloggerName, incorrectBloggerYoutubeUrl)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlogger)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)},{field:"youtubeUrl","message":expect.any(String)}]})
    })
    it('6.Should return status 400 and array with error in name (/post)', async () => {
        const incorrectBloggerName="testName111111111111111111111111"
        const correctBloggerYoutubeUrl="https://www.youtube.com/test"
        const notCorrectBlogger = createBloggerForTesting(incorrectBloggerName, correctBloggerYoutubeUrl)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlogger)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)}]})
    })
    it('7.Should return status 400 and array with error in name (/post)', async () => {
        const incorrectBloggerName=""
        const correctBloggerYoutubeUrl="https://www.youtube.com/test"
        const notCorrectBlogger = createBloggerForTesting(incorrectBloggerName, correctBloggerYoutubeUrl)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlogger)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)}]})
    })
    it('8.Should return status 400 and array with errors in name and youtubeUrl (/post)', async () => {
        const incorrectBloggerName=""
        const incorrectBloggerYoutubeUrl=""
        const notCorrectBlogger = createBloggerForTesting(incorrectBloggerName, incorrectBloggerYoutubeUrl)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(notCorrectBlogger)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)},{field:"youtubeUrl","message":expect.any(String)}]})
    })
    it('9.Should return status 201 and newly created blogger (/post)', async () => {
        const bloggerName1="testName1"
        const bloggerYoutubeUrl1="https://www.youtube.com/test1"
        const correctBlogger1 = createBloggerForTesting(bloggerName1, bloggerYoutubeUrl1)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogger1)
            .expect(201)
        expect(response.body).toEqual({
            id: response.body.id,
            name: bloggerName1,
            youtubeUrl: bloggerYoutubeUrl1
        })
        expect(response.body.id).toEqual(expect.any(String))

    })
    it('10.Should return status 200 and correct blogger (/get)', async () => {
        const bloggerName1="testName1"
        const bloggerYoutubeUrl1="https://www.youtube.com/test1"
        const response=await request(app)
            .get('/bloggers')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body).toEqual(createDbReturnDataForAllBloggers(1,1,10,1,
            { id: response.body.items[0].id,
            name: bloggerName1,
            youtubeUrl: bloggerYoutubeUrl1}))
    })
    it('11.Should return status 201 and newly created blogger (/post)', async () => {
        const bloggerName2="testName2"
        const bloggerYoutubeUrl2="https://www.youtube.com/test2"
        const correctBlogger2 = createBloggerForTesting(bloggerName2, bloggerYoutubeUrl2)
        const response=await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogger2 )
            .expect(201)
        expect(response.body).toEqual({
            id: response.body.id,
                name: bloggerName2,
                youtubeUrl: bloggerYoutubeUrl2
        })
        expect(response.body.id).toEqual(expect.any(String))

    })
    it('12.Should return status 200 and correct bloggers (/get)', async () => {
        const bloggerName1="testName1"
        const bloggerYoutubeUrl1="https://www.youtube.com/test1"
        const bloggerName2="testName2"
        const bloggerYoutubeUrl2="https://www.youtube.com/test2"
        const response=await request(app)
            .get('/bloggers')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body.items[1].id).toEqual(expect.any(String))
        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [{
                id: response.body.items[0].id,
                name: bloggerName1,
                youtubeUrl: bloggerYoutubeUrl1
            },{
                id: response.body.items[1].id,
                name: bloggerName2,
                youtubeUrl: bloggerYoutubeUrl2
            }]
        })
    })
    it('13.Should return status 200,correct blogger and correct pagination (/get)', async () => {
        const bloggerName1="testName1"
        const bloggerYoutubeUrl1="https://www.youtube.com/test1"
        const response=await request(app)
            .get('/bloggers?PageNumber=1&PageSize=1')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body).toEqual(createDbReturnDataForAllBloggers(2,1,1,2,
            { id: response.body.items[0].id,
                name: bloggerName1,
                youtubeUrl: bloggerYoutubeUrl1}))
    })
    it('14.Should return status 200,correct blogger and correct pagination (/get)', async () => {
        const bloggerName2="testName2"
        const bloggerYoutubeUrl2="https://www.youtube.com/test2"
        const response=await request(app)
            .get('/bloggers?PageNumber=2&PageSize=1')
            .expect(200)
        expect(response.body.items[0].id).toEqual(expect.any(String))
        expect(response.body).toEqual(createDbReturnDataForAllBloggers(2,2,1,2,
            { id: response.body.items[0].id,
                name: bloggerName2,
                youtubeUrl: bloggerYoutubeUrl2}))
    })
    it('15. return status 200 and correct blogger by Id (/get)', async () => {
        const bloggerName1="testName1"
        const blogger=await BloggersModelClass.findOne({name: bloggerName1})
        const bloggerYoutubeUrl1="https://www.youtube.com/test1"
        const response=await request(app)
            .get(`/bloggers/${blogger!.id}`)
            .expect(200)
        expect(blogger!.id).toEqual(expect.any(String))
        expect(response.body).toEqual(
            { id: blogger!.id,
                name: bloggerName1,
                youtubeUrl: bloggerYoutubeUrl1})
    })
    it('16.Should return status 404 with incorrect Id (/get)', async () => {
        await request(app)
            .get(`/bloggers/5`)
            .expect(404)

    })
    it('17.Should return status 401 (/put) ', async () => {
        const correctBlogger = createBloggerForTesting("testName", "https://www.youtube.com/test")
        const response1= await request(app)
            .get('/bloggers')
        await request(app)
            .put(`/bloggers/${response1.body.items[0].id}`)
            .send(correctBlogger)
            .expect(401)

    })
    it('18.Should return status 404 with incorrect Id (/put)', async () => {
        await request(app)
            .put(`/bloggers/5`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

    })
    it('19.Should return status 204 and updated blogger (/put) ', async () => {
        const oldBloggerName1="testName1"
        const newBloggerName1="newTestName1"
        const blogger=await BloggersModelClass.findOne({name: oldBloggerName1})
        const newBloggerYoutubeUrl1="https://www.youtube.com/test1new"
        await request(app)
            .put(`/bloggers/${blogger!.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: newBloggerName1, youtubeUrl: newBloggerYoutubeUrl1})
            .expect(204)
        const response=await request(app)
            .get(`/bloggers/${blogger!.id}`)
            .expect(200)
        expect(response.body.name).toBe(newBloggerName1)
        expect(response.body.youtubeUrl).toBe(newBloggerYoutubeUrl1)

    })
    it('20.Should return status 400 and and array with error in name (/put) ', async () => {
        const oldBloggerName1="newTestName1"
        const newBloggerName1="newTestName11111111111111111111111111"
        const blogger=await BloggersModelClass.findOne({name: oldBloggerName1})
        const newBloggerYoutubeUrl1="https://www.youtube.com/test1new"
        const response=await request(app)
            .put(`/bloggers/${blogger!.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({name: newBloggerName1, youtubeUrl: newBloggerYoutubeUrl1})
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"name","message":expect.any(String)}]})
    })
    it('21.Should return status 200 and correct bloggers (/delete)', async () => {
        const newBloggerName1="newTestName1"
        const blogger=await BloggersModelClass.findOne({name: newBloggerName1})
        await request(app)
            .delete(`/bloggers/${blogger!.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)
        const response=await request(app)
            .get('/bloggers')
            .expect(200)
        expect(response.body.items.length).toBe(1)
    })
    it('22.Should return status 401 (/delete)', async () => {
        const bloggerName2="testName2"
        const blogger=await BloggersModelClass.findOne({name: bloggerName2})
        await request(app)
            .delete(`/bloggers/${blogger!.id}`)
            .expect(401)
    })
    it('23.Should return status 404 for non existing id (/delete)', async () => {
        await request(app)
            .delete(`/bloggers/5`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
    })
    it('24.Should return status 201 and a new post for specific blogger (/post)', async () => {
        const bloggerName2="testName2"
        const title="testTitle"
        const shortDescription="testShortDescription"
        const content="testContent"
        const newPost=createPostForTestingInBloggers(title, shortDescription, content)
        const blogger=await BloggersModelClass.findOne({"items.name": bloggerName2})
        const response=await request(app)
            .post(`/bloggers/${blogger!.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
            .expect(201)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body).toEqual({
            "id": response.body.id,
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "bloggerId": `${blogger!.id}`,
            "bloggerName": bloggerName2,
            "addedAt": response.body.addedAt,
            "extendedLikesInfo": {
                "likesCount": 0,
                "dislikesCount": 0,
                "myStatus": "None",
                "newestLikes": []
            }
        })
    })
    it('25.Should return status 400 and array with error (/post) ', async () => {
        const bloggerName2="testName2"
        const title=""
        const shortDescription="testShortDescription"
        const content="testContent"
        const newPost=createPostForTestingInBloggers(title, shortDescription, content)
        const blogger=await BloggersModelClass.findOne({"items.name": bloggerName2})
        const response=await request(app)
            .post(`/bloggers/${blogger!.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)}]})
    })
    it('26.Should return status 400 and array of errors ', async () => {
        const bloggerName2="testName2"
        const title=""
        const shortDescription=""
        const content="testContent"
        const newPost=createPostForTestingInBloggers(title, shortDescription, content)
        const blogger=await BloggersModelClass.findOne({"items.name": bloggerName2})
        const response=await request(app)
            .post(`/bloggers/${blogger!.id}/posts`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"title","message":expect.any(String)},{field:"shortDescription","message":expect.any(String)}]})
    })
    it('27.Should return status 401 (/post) ', async () => {
        const bloggerName2="testName2"
        const title="testTitle"
        const shortDescription=""
        const content="testContent"
        const newPost=createPostForTestingInBloggers(title, shortDescription, content)
        const blogger=await BloggersModelClass.findOne({"items.name": bloggerName2})
        await request(app)
            .post(`/bloggers/${blogger!.id}/posts`)
            .send(newPost)
            .expect(401)
    })
    it('28.Should return status 404 (/get) ', async () => {
        await request(app)
            .get(`/bloggers/5/posts`)
            .expect(404)
    })
    it('29.Should return status 200 (/get) ', async () => {
        const bloggerName2="testName2"
        const title="testTitle"
        const shortDescription="testShortDescription"
        const content="testContent"
        const blogger=await BloggersModelClass.findOne({"items.name": bloggerName2})
        const response=await request(app)
            .get(`/bloggers/${blogger!.id}/posts`)
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
                    "bloggerId": `${blogger!.id}`,
                    "bloggerName": bloggerName2,
                    "addedAt": response.body.items[0].addedAt,
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
    it('30.Should return status 200,correct blogger in query name (/get)', async () => {
        const bloggerName2="blogger"
        const bloggerYoutubeUrl2="https://www.youtube.com/test3"
        const correctBlogger = createBloggerForTesting(bloggerName2, bloggerYoutubeUrl2)
        await request(app)
            .post('/bloggers')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctBlogger )
            .expect(201)
        const response2=await request(app)
            .get('/bloggers?SearchNameTerm=blogger')
            .expect(200)
        expect(response2.body.items[0].id).toEqual(expect.any(String))
        expect(response2.body).toEqual(createDbReturnDataForAllBloggers(1,1,10,1,
            { id: response2.body.items[0].id,
                name: bloggerName2,
                youtubeUrl: bloggerYoutubeUrl2}))
    })
})








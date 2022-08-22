import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import {app} from "../index";
import {UsersAccountModelClass} from "../repositories/db";



export const createUserForTesting = (login:string,email:string,password:string) => {
    return{
        login: login,
        email: email,
        password: password
    }
}



describe('endpoint /users ',  () => {
    const emptyAllUsersDbReturnData={
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
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
            .get('/users')
            .expect(200)
        expect(response.body).toEqual(emptyAllUsersDbReturnData)
    })
    it('3.Should return status 401 (/post) ', async () => {
        const correctUser = createUserForTesting("testLogin", "test@email.test", "testPassword")
        await request(app)
            .post('/users')
            .send(correctUser)
            .expect(401)
    })
    it('4.Should return status 201 (/post) ', async () => {
        const correctUser = createUserForTesting("user1", "user1@email.test", "user1Password")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUser)
            .expect(201)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body).toEqual({id:response.body.id,login: "user1"})
    })
    it('5.Should return status 400 (/post) ', async () => {
        const correctLogin = "user2"
        const incorrectEmail = "test"
        const incorrectUser = createUserForTesting(correctLogin, incorrectEmail, "testPassword")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectUser)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"email","message":expect.any(String)}]})
    })
    it('6.Should return status 400 (/post) ', async () => {
        const loginIsExist = "user1"
        const correctEmail = "user2@email.test"
        const incorrectUser = createUserForTesting(loginIsExist, correctEmail, "user2Password")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectUser)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"login","message":expect.any(String)}]})
    })
    it('7.Should return status 400 (/post) ', async () => {
        const correctLogin = "user2"
        const emailIsExist = "user1@email.test"
        const incorrectUser = createUserForTesting(correctLogin, emailIsExist, "user2Password")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectUser)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"email","message":expect.any(String)}]})
    })
    it('8.Should return status 400 (/post) ', async () => {
        const incorrectLogin = "t"
        const incorrectEmail = "test"
        const incorrectUser = createUserForTesting(incorrectLogin, incorrectEmail, "testPassword")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectUser)
            .expect(400)
        expect(response.body.errorsMessages.length).toBe(2)
    })
    it('9.Should return status 400 (/post) ', async () => {
        const incorrectLogin = ""
        const correctEmail = "user2@email.test"
        const incorrectUser = createUserForTesting(incorrectLogin, correctEmail, "testPassword")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(incorrectUser)
            .expect(400)
        expect(response.body).toEqual({errorsMessages:[{field:"login","message":expect.any(String)}]})
    })
    it('10.Should return status 201 (/post) ', async () => {
        const correctUser2 = createUserForTesting("user2", "user2@email.test", "user2Password")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUser2)
            .expect(201)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body).toEqual({id:response.body.id,login: "user2"})
    })
    it('11.Should return status 200 and correct body (/get)', async () => {
        const dbData= await UsersAccountModelClass.find({}, {_id:0,id:1,login:1}).lean()
        const response=await request(app)
            .get('/users')
            .expect(200)
        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: dbData
        })
    })
    it('12.Should return status 200 and correct body with pagination (/get)', async () => {
        const dbData= await UsersAccountModelClass.find({}, {_id:0,id:1,login:1}).lean()
        const response=await request(app)
            .get('/users?PageNumber=1&PageSize=1')
            .expect(200)
        expect(response.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 1,
            totalCount: 2,
            items: [dbData[0]]
        })
    })
    it('13.Should return status 200 and correct body with pagination (/get)', async () => {
        const dbData= await UsersAccountModelClass.find({}, {_id:0,id:1,login:1}).lean()
        const response=await request(app)
            .get('/users?PageNumber=2&PageSize=1')
            .expect(200)
        expect(response.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 1,
            totalCount: 2,
            items: [dbData[1]]
        })
    })
    it('14.Should return status 401 for not authorized user (/delete)', async () => {
        const dbData= await UsersAccountModelClass.find({}, {_id:0,id:1,login:1}).lean()
        await request(app)
            .delete(`/users/${dbData[0].id}`)
            .expect(401)
    })
    it('15.Should return status 404 for non existing id (/delete)', async () => {
        await request(app)
            .delete(`/users/000`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)
    })
    it('16.Should return status 204 and delete user (/delete)', async () => {
        const dbData= await UsersAccountModelClass.find({}, {_id:0,id:1,login:1}).lean()
        await request(app)
            .delete(`/users/${dbData[0].id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)
        expect(await UsersAccountModelClass.find({}, {_id:0,id:1,login:1}).lean()).toEqual([dbData[1]])
    })
})
import request from 'supertest'
import {app} from "../index";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {createUserForTesting} from "./users-router.test";





describe('endpoint /auth ',  () => {
    let mongoServer: MongoMemoryServer;
    beforeAll( async () => {
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
    it('2.Should return status 201 (/post) ', async () => {
        const correctUser = createUserForTesting(5, 2, 10)
        const response1=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUser)
            .expect(201)
        expect(response1.body.id).toEqual(expect.any(String))
        expect(response1.body.createdAt).toEqual(expect.any(String))
        expect(response1.body).toEqual({id:response1.body.id,login: correctUser.login, email: correctUser.email, createdAt: response1.body.createdAt})
    // Should return status 200,JWT accessToken and JWT refreshToken in cookie (/post)
        const response2=await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser.login,password:correctUser.password})
            .expect(200)
        expect(response2.body).toEqual({"accessToken":expect.any(String)})
        expect(response2.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('refreshToken')]))
    // Should return status 429 after 5 requests (/post)
        await new Promise(res => setTimeout(res, 10000))
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser.login,password:correctUser.password})
            .expect(200)
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({loginOrEmail: correctUser.login,password:correctUser.password})
                    .expect(200)
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({loginOrEmail: correctUser.login,password:correctUser.password})
                    .expect(200);
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({loginOrEmail: correctUser.login,password:correctUser.password})
                    .expect(200);
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({loginOrEmail: correctUser.login,password:correctUser.password})
                    .expect(200);
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({loginOrEmail: correctUser.login,"password":correctUser.password})
                    .expect(429);
            },)
    // Should return status 401  (/post)
        await new Promise(res => setTimeout(res, 10000))
        const incorrectLogin = "authUser"
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: incorrectLogin, password: correctUser.password})
            .expect(401)
    // Should return status 401  (/post)
        const incorrectPassword = "authUser1Passwor"
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser.login, password: incorrectPassword})
            .expect(401)
    })
})
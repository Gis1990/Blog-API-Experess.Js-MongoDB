import request from 'supertest'
import {app} from "../index";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {JwtService} from "../application/jwt-service";





describe('endpoint /auth ',  () => {
    const createUserForTesting = (login:string,email:string,password:string) => {
        return{
            login: login,
            email: email,
            password: password
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
    it('2.Should return status 201 (/post) ', async () => {
        const correctUser = createUserForTesting("authUser1", "authUser1@email.test", "authUser1Password")
        const response=await request(app)
            .post('/users')
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(correctUser)
            .expect(201)
        expect(response.body.id).toEqual(expect.any(String))
        expect(response.body).toEqual({id:response.body.id,login: "authUser1",email: "authUser1@email.test",adededAt:response.body.adededAt})
    })
    it('3.Should return status 200,JWT accessToken and JWT refreshToken in cookie (/post) ', async () => {
        const login= "authUser1"
        const password= "authUser1Password"
        const response=await request(app)
            .post('/auth/login')
            .send({"login": login,"password":password})
            .expect(200)
        expect(response.body).toEqual({"accessToken":expect.any(String)})
        expect(response.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('refreshToken')]))
    })
    it('4.Should return status 429 after 5 requests (/post) ', async () => {
        await new Promise(res => setTimeout(res, 10000))
        const login= "authUser1"
        const password= "authUser1Password"
        await request(app)
            .post('/auth/login')
            .send({"login": login,"password":password})
            .expect(200)
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({"login": login,"password":password})
                    .expect(200)
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({"login": login,"password":password})
                    .expect(200);
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({"login": login,"password":password})
                    .expect(200);
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({"login": login,"password":password})
                    .expect(200);
            })
            .then(function (res) {
                return request(app)
                    .post("/auth/login")
                    .send({"login": login,"password":password})
                    .expect(429);
            },)
    })
    it('5.Should return status 401  (/post) ', async () => {
        await new Promise(res => setTimeout(res, 10000))
        const incorrectLogin = "authUser"
        const password = "authUser1Password"
        await request(app)
            .post('/auth/login')
            .send({"login": incorrectLogin, "password": password})
            .expect(401)
    })
    it('6.Should return status 401  (/post) ', async () => {
        const login = "authUser!"
        const incorrectPassword = "authUser1Passwor"
        await request(app)
            .post('/auth/login')
            .send({"login": login, "password": incorrectPassword})
            .expect(401)
    })
})
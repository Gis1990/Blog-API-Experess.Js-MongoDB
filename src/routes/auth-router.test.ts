import request from 'supertest'
import {app} from "../index";
import {createUserForTesting, setupTestDB, teardownTestDB} from "../tests/test.functions";





// This block sets up a MongoDB in-memory server and starts a connection to it before running the tests
// and cleans up after all tests are finished
describe('endpoint /auth ',  () => {
    beforeAll(async () => {
        await setupTestDB();
    });
    afterAll(async () => {
        await teardownTestDB();
    });
// Test deleting all data from the testing endpoint and expecting a status code of 204
    it('1.Should return status 204 (/delete)', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    })
// Test creating a new user and expecting a status code of 201
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
// Test logging in as the new user and expecting a status code of 200 and a JWT access token and refresh token in the cookie
        const response2=await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser.login,password:correctUser.password})
            .expect(200)
        expect(response2.body).toEqual({"accessToken":expect.any(String)})
        expect(response2.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('refreshToken')]))
// Test sending too many login requests within a short time period and expecting a status code of 429
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
    // Test logging in with an incorrect login and expecting a status code of 401
        await new Promise(res => setTimeout(res, 10000))
        const incorrectLogin = "authUser"
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: incorrectLogin, password: correctUser.password})
            .expect(401)
    // Test logging in with an incorrect password and expecting a status code of 401
        const incorrectPassword = "authUser1Passwor"
        await request(app)
            .post('/auth/login')
            .send({loginOrEmail: correctUser.login, password: incorrectPassword})
            .expect(401)
    })
})
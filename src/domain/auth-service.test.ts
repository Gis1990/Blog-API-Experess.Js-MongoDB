import {UsersRepository} from "../repositories/users-repository";
import {EmailAdapter} from "../application/email-adapter";
import {UsersService} from "./users-service";
import {JwtService} from "../application/jwt-service";
import {AuthService} from "./auth-service";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UsersAccountModelClass} from "../repositories/db";
import {ObjectId} from "mongodb";
import {addMinutes} from "date-fns";
import {container} from "../composition-root";
import {UsersQueryRepository} from "../repositories/users-query-repository";



describe("integration tests for AuthService", () => {
    const usersQueryRepository = container.get<UsersQueryRepository>(
        UsersQueryRepository)
    mongoose.disconnect()
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

    const usersRepository = new UsersRepository()
    const emailControllerMock: jest. Mocked<EmailAdapter> = {
        sendEmailWithRegistration: jest.fn(),
        sendEmailWithPasswordRecovery: jest.fn()
    }
    const usersService = new UsersService(usersRepository)
    const jwtService = new JwtService()
    const authService= new AuthService(usersRepository,usersQueryRepository,emailControllerMock,usersService,jwtService)


    describe("createUserWithConfirmationEmail", () => {
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })
        it("this.emailAdapter.send Email should be called", async () => {
            let email = "anton.pavlovskiy1991@gmail.com"
            let login = "anton1"
            await authService.createUserWithConfirmationEmail(login, email, "12345678")
            expect(emailControllerMock.sendEmailWithRegistration).toBeCalled()
        })
        it("should return correct created user ", async () => {
            let email="anton.pavlovskiy1990@gmail.com"
            let login="anton"
            const result=await authService.createUserWithConfirmationEmail(login,email,"12345678")
            expect(result.email).toBe(email)
            expect(result.login).toBe(login)
            expect(result.emailConfirmation.isConfirmed).toBe(false)
            expect(result.loginAttempts.length).toBe(0)
        })
    })
    describe("confirmEmail", () => {
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })
        function createUser(confirmationCode: string, expirationDate: Date) {
            return {
                _id: new ObjectId,
                id:Number((new Date())).toString(),
                login: "antonConfirmEmail",
                email: "myemail@google.com",
                passwordHash: "",
                createdAt: new Date(),
                loginAttempts: [],
                emailConfirmation: {
                    isConfirmed: false,
                    confirmationCode: confirmationCode,
                    expirationDate: expirationDate,
                    sentEmails: []
                },
                blacklistedRefreshTokens: []
            }
        }
        it("should return false for expired confirmation code ", async () => {
            const newUser1=createUser("myCode",addMinutes(new Date(), -1))
            await UsersAccountModelClass.insertMany([newUser1])
            await authService.confirmEmail("myCode")
            const userModel=await UsersAccountModelClass.findOne({ id: newUser1.id })
            expect(userModel!.emailConfirmation.isConfirmed).toBeFalsy()
        })
        it("should return false for not existed confirmation code ", async () => {
            const spy=jest.spyOn(usersRepository,"updateConfirmationCode")
            const result=await authService.confirmEmail("myCode")
            expect(result).toBeFalsy()
            expect(spy).not.toBeCalled()
        })
        it("should return true for existing confirmation code and email ", async () => {
            const newUser2=createUser("goodCode",addMinutes(new Date(), 1))
            await UsersAccountModelClass.insertMany([newUser2])
            await authService.confirmEmail("goodCode")
            const userModel=await UsersAccountModelClass.findOne({ id: newUser2.id })
            expect(userModel!.emailConfirmation.isConfirmed).toBeTruthy()
        })
    })
    describe("createUserWithoutConfirmationEmail", () => {
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })
        it("this.emailAdapter.send Email should be called", async () => {
            let email = "anton.pavlovskiy1991@gmail.com"
            let login = "anton1"
            await authService.createUserWithoutConfirmationEmail(login, email, "12345678")
            expect(emailControllerMock.sendEmailWithRegistration).toBeCalled()
        })
        it("should return correct created user ", async () => {
            let email="anton.pavlovskiy1990@gmail.com"
            let login="anton"
            const result=await authService.createUserWithoutConfirmationEmail(login,email,"12345678")
            expect(result.login).toBe(login)
        })
    })
    describe("checkCredentials", () => {
        afterAll(async () => {
            await mongoose.connection.db.dropDatabase()
        })
        function createUserForCredentials(login:string,email:string,status: boolean) {
            return {
                _id: new ObjectId,
                id:Number((new Date())).toString(),
                login: login,
                email: email,
                passwordHash: "$2b$10$pfyO12ZdXz25c961Uu4N0eXdqsvm7wpi2V.Dr7w9esJbqgmc0iITe",
                createdAt: new Date(),
                loginAttempts: [],
                emailConfirmation: {
                    isConfirmed: status,
                    confirmationCode: "myCode",
                    expirationDate: addMinutes(new Date(), 1),
                    sentEmails: []
                },
                blacklistedRefreshTokens: []
            }
        }
        it("should return null not confirmed email ", async () => {
            const newUser1=createUserForCredentials("antonCheckCredentials1","myemail@google.com",false)
            await UsersAccountModelClass.insertMany([newUser1])
            const result=await authService.checkCredentials("antonCheckCredentials1","string","ip","browser")
            expect(result).toBeNull()
        })
        it("with correct data should return array with tokens ", async () => {
            const newUser2=createUserForCredentials("antonCheckCredentials2","myemail@google.com",true)
            await UsersAccountModelClass.insertMany([newUser2])
            const result=await authService.checkCredentials("antonCheckCredentials2","string","ip","browser")
            expect(result).toEqual(
                expect.arrayContaining([expect.any(String),expect.any(String)])
            );
        })
        it("should return null for not existed user ", async () => {
            const result=await authService.checkCredentials("login", "password","ip","browser")
            expect(result).toBeNull()
        })
    })
})




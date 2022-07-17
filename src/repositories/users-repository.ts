import {UserAccountDBType, UserDBTypePagination} from "./types";
import {UsersAccountModel} from "./db";
import {v4 as uuidv4} from "uuid";


export const usersRepository = {
     async getAllUsers (PageNumber: number, PageSize: number ): Promise<UserDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        const allUsers=await UsersAccountModel.find({}, { projection: { _id:0,"accountData.id":1,"accountData.login":1} }).skip(skips).limit(PageSize).lean()
        const cursor=allUsers.map(user=>user.accountData)
        const totalCount=await UsersAccountModel.count({})
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async findUserById(id: string): Promise<UserAccountDBType | null> {
        let user = await UsersAccountModel.findOne({"accountData.id": id})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return UsersAccountModel.findOne(({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]}));
    },
    async findUserByConfirmationCode(emailConfirmationCode: string) {
        return UsersAccountModel.findOne({"emailConfirmation.confirmationCode": emailConfirmationCode});
    },
    async updateConfirmation (id: string) {
        const result = await UsersAccountModel.updateOne({"accountData.id": id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    },
    async updateConfirmationCode (id: string) {
        const newConfirmationCode=uuidv4()
        const result = await UsersAccountModel.updateOne({"accountData.id": id}, {$set: {"emailConfirmation.confirmationCode": newConfirmationCode}})
        return result.modifiedCount === 1
    },
    async addLoginAttempt (id: string, ip:string) {
        let result = await UsersAccountModel.updateOne({"accountData.id": id}, {$push: {"accountData.loginAttempts": new Date(),ip:ip}})
        return result.modifiedCount === 1
    },
    async addEmailLog (email: string) {
        let result = await UsersAccountModel.updateOne({"accountData.email": email}, {$push: {"emailConfirmation.sentEmails": new Date()}})
        return result.modifiedCount === 1
    },
    async createUser (newUser:UserAccountDBType): Promise<UserAccountDBType>  {
         await UsersAccountModel.insertMany([newUser]);
         return newUser;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await UsersAccountModel.deleteOne({"accountData.id": id});
        return result.deletedCount === 1
    }
}
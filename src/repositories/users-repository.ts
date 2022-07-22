import {getNewUserAccountType, UserAccountDBType, UserDBTypePagination} from "./types";
import {UsersAccountModelClass} from "./db";
import {v4 as uuidv4} from "uuid";


export const usersRepository = {
     async getAllUsers (PageNumber: number, PageSize: number ): Promise<UserDBTypePagination> {
        const skips = PageSize * (PageNumber - 1)
        const allUsers=await UsersAccountModelClass.find({}, {_id:0,"accountData.id":1,"accountData.login":1}).skip(skips).limit(PageSize).lean()
        const cursor=allUsers.map(user=>user.accountData)
        const totalCount=await UsersAccountModelClass.count({})
        return {
            pagesCount: Math.ceil(totalCount/PageSize),
            page: PageNumber,
            pageSize:PageSize,
            totalCount: totalCount,
            items: cursor
        }
    },
    async findUserById(id: string): Promise<UserAccountDBType | null> {
        let user = await UsersAccountModelClass.findOne({"accountData.id": id},{_id:0,emailConfirmation:0,loginAttempts:0,"accountData.passwordHash":0,"accountData.createdAt":0,refreshTokensBlackList:0,})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return UsersAccountModelClass.findOne(({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]}));
    },
    async findUserByConfirmationCode(emailConfirmationCode: string) {
        return UsersAccountModelClass.findOne({"emailConfirmation.confirmationCode": emailConfirmationCode});
    },
    async updateConfirmation (id: string) {
        const result = await UsersAccountModelClass.updateOne({"accountData.id": id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    },
    async updateConfirmationCode (id: string) {
        const newConfirmationCode=uuidv4()
        const result = await UsersAccountModelClass.updateOne({"accountData.id": id}, {$set: {"emailConfirmation.confirmationCode": newConfirmationCode}})
        return result.modifiedCount === 1
    },
    async addLoginAttempt (id: string, ip:string) {
        const loginAttempt={attemptDate: new Date(),ip:ip}
        const result = await UsersAccountModelClass.updateOne({"accountData.id": id}, {$push: {"loginAttempts": loginAttempt}})
        return result.modifiedCount === 1
    },
    async addEmailLog (email: string) {
        const emailData={sentDate: new Date()}
        const result = await UsersAccountModelClass.updateOne({"accountData.email": email}, {$push: {"emailConfirmation.sentEmails": emailData}})
        return result.modifiedCount === 1
    },
    async addRefreshTokenIntoBlackList(id: string,token:string) {
        const tokenForBlackList={token}
        const result = await UsersAccountModelClass.updateOne({"accountData.id": id},{$push: {"refreshTokensBlackList": tokenForBlackList}})
        return result.modifiedCount === 1
    },
    async findRefreshTokenInBlackList(id: string,token:string) {
        return  UsersAccountModelClass.findOne({"accountData.id": id,refreshTokensBlackList : {$in :token}},{_id:1}).lean()
    },
    async createUser (newUser:UserAccountDBType): Promise<getNewUserAccountType>  {
         await UsersAccountModelClass.insertMany([newUser]);
         const {_id,refreshTokensBlackList,...newUserWithoutIdAndTokens}=newUser
         const {passwordHash,createdAt,...newUserWithoutHashAndDate}=newUserWithoutIdAndTokens.accountData
         const user={...newUserWithoutHashAndDate,emailConfirmation:newUser.emailConfirmation}
         return user;
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await UsersAccountModelClass.deleteOne({"accountData.id": id});
        return result.deletedCount === 1
    }

}
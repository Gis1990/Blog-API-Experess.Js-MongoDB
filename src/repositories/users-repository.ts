import { RefreshTokenClass, SentEmailsClass, UserAccountDBClass, UserDBClassPagination} from "../types/types";
import {PostsModelClass, UsersAccountModelClass} from "./db";
import {v4 as uuidv4} from "uuid";
import {LoginAttemptsClass} from "../types/types";



export  class UsersRepository  {
     async getAllUsers (searchLoginTerm:string|null,searchEmailTerm:string|null,pageNumber: number, pageSize: number,sortBy:string,sortDirection:string ): Promise<UserDBClassPagination> {
        const skips = pageSize * (pageNumber - 1)
         let cursor
         let totalCount
        let sortObj:any={}
         if (!searchLoginTerm||!searchEmailTerm) {
             if (sortDirection==="desc"){
                 sortObj[sortBy]=-1
                 cursor=await UsersAccountModelClass.find({}, {_id:0,id:1,login:1,email:1,createdAt:1}).sort(sortObj).skip(skips).limit(pageSize).lean()
                 totalCount=await UsersAccountModelClass.count({})
             }else{
                 sortObj[sortBy]=1
                 cursor=await UsersAccountModelClass.find({}, {_id:0,id:1,login:1,email:1,createdAt:1}).sort(sortObj).skip(skips).limit(pageSize).lean()
                 totalCount=await UsersAccountModelClass.count({})
             }
         }else{
             if (sortDirection==="desc"){
                 sortObj[sortBy]=-1
                 cursor = await UsersAccountModelClass.find({
                     "$or": [
                         {login: {$regex: searchLoginTerm, $options: 'i'}},
                         {email: {$regex: searchEmailTerm, $options: 'i'}}
                     ]
                 }, {_id: 0, id: 1, login: 1, email: 1, createdAt: 1}).sort(sortObj).skip(skips).limit(pageSize).lean()
                 totalCount = await UsersAccountModelClass.count({
                     "$or": [
                         {login: {$regex: searchLoginTerm, $options: 'i'}},
                         {email: {$regex: searchEmailTerm, $options: 'i'}}
                     ]
                 })
             }else{
                 sortObj[sortBy]=1
                 cursor = await UsersAccountModelClass.find({
                     "$or": [
                         {login: {$regex: searchLoginTerm, $options: 'i'}},
                         {email: {$regex: searchEmailTerm, $options: 'i'}}
                     ]
                 }, {_id: 0, id: 1, login: 1, email: 1, createdAt: 1}).sort(sortObj).skip(skips).limit(pageSize).lean()
                 totalCount = await UsersAccountModelClass.count({
                     "$or": [
                         {login: {$regex: searchLoginTerm, $options: 'i'}},
                         {email: {$regex: searchEmailTerm, $options: 'i'}}
                     ]
                 })
             }}
        return new UserDBClassPagination(Math.ceil(totalCount/pageSize),pageNumber,pageSize,totalCount,cursor)
    }
    async findUserById(id: string): Promise<UserAccountDBClass | null> {
        let user = await UsersAccountModelClass.findOne({"id": id},{_id:0,emailConfirmation:0,loginAttempts:0,passwordHash:0,createdAt:0,blacklistedRefreshTokens:0,})
        if (user) {
            return user
        } else {
            return null
        }
    }
    async findByLoginOrEmail(loginOrEmail: string) {
        return UsersAccountModelClass.findOne(({$or: [{email: loginOrEmail}, {login: loginOrEmail}]}));
    }
    async findUserByConfirmationCode(emailConfirmationCode: string) {
        return UsersAccountModelClass.findOne({"emailConfirmation.confirmationCode": emailConfirmationCode});
    }
    async updateConfirmation (id: string) {
        const result = await UsersAccountModelClass.updateOne({id: id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    }
    async updateConfirmationCode (id: string) {
        const newConfirmationCode=uuidv4()
        const result = await UsersAccountModelClass.updateOne({id: id}, {$set: {"emailConfirmation.confirmationCode": newConfirmationCode}})
        return result.modifiedCount === 1
    }
    async addLoginAttempt (id: string, ip:string) {
        const loginAttempt: LoginAttemptsClass=new LoginAttemptsClass(new Date(),ip)
        const result = await UsersAccountModelClass.updateOne({id: id}, {$push: {loginAttempts: loginAttempt}})
        return result.modifiedCount === 1
    }
    async addEmailLog (email: string) {
        const emailData: SentEmailsClass=new SentEmailsClass(Number((new Date())).toString())
        const result = await UsersAccountModelClass.updateOne({email: email}, {$push: {"emailConfirmation.sentEmails": emailData}})
        return result.modifiedCount === 1
    }
    async addRefreshTokenIntoBlackList(id: string,token:string) {
        const tokenForBlackList: RefreshTokenClass=new RefreshTokenClass(token)
        const result = await UsersAccountModelClass.updateOne({id: id},{$push: {"blacklistedRefreshTokens": tokenForBlackList}})
        return result.modifiedCount === 1
    }
    async findRefreshTokenInBlackList(id: string,token:string) {
        return  UsersAccountModelClass.findOne({id: id,blacklistedRefreshTokens: {$in :{token}}},{_id:1}).lean()
    }
    async createUser (newUser:UserAccountDBClass): Promise<UserAccountDBClass>  {
         await UsersAccountModelClass.insertMany([newUser]);
         return newUser;
    }
    async deleteUserById(id: string): Promise<boolean> {
        const result = await UsersAccountModelClass.deleteOne({id: id});
        return result.deletedCount === 1
    }

}



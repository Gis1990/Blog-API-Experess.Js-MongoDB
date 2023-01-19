import {
    UserAccountDBClass,
    UserDBPaginationClass,
} from "../../classes/classes";
import {UsersAccountModelClass} from "../db";
import {injectable} from "inversify";


@injectable()
export  class UsersQueryRepository  {
    async getAllUsers (obj:{searchLoginTerm?:string|null,searchEmailTerm?:string|null,pageNumber?: number, pageSize?: number,sortBy?:string,sortDirection?:string }): Promise<UserDBPaginationClass> {
        let {
            searchLoginTerm = null,
            searchEmailTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = obj;

        pageNumber= Number(pageNumber)
        pageSize=  Number(pageSize)
        // Calculate the number of documents to skip based on the page size and number
        const skips = pageSize * (pageNumber - 1);

        // Create an object for sorting the results based on the sortBy and sortDirection parameters
        let sortObj: any = {};
        if (sortDirection === 'desc') {
            sortObj[sortBy] = -1;
        } else {
            sortObj[sortBy] = 1;
        }

        // Create a query object based on the searchLoginTerm and searchEmailTerm parameters
        let query: any = {};
        if (searchLoginTerm && searchEmailTerm) {
            query = {
                "$or": [
                    {login: {$regex: searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchEmailTerm, $options: 'i'}}
                ]
            };
        }

        // Retrieve the documents from the UsersAccountModelClass collection, applying the query, sort, skip, and limit options
        const cursor = await UsersAccountModelClass.find(query, {_id: 0, id: 1, login: 1, email: 1, createdAt: 1})
            .sort(sortObj)
            .skip(skips)
            .limit(pageSize)
            .lean();

        // Count the total number of documents that match the query
        const totalCount = await UsersAccountModelClass.count(query);

        // Return a new UserDBClassPagination object with the calculated pagination information and the retrieved documents
        return new UserDBPaginationClass(Math.ceil(totalCount/pageSize),pageNumber,pageSize,totalCount,cursor);
    }
    async findUserById(id: string): Promise<UserAccountDBClass | null> {
        let user = await UsersAccountModelClass.findOne({id: id},{_id:0,emailConfirmation:0,loginAttempts:0,passwordHash:0,createdAt:0,emailRecoveryCode:0})
        if (user) {
            return user
        } else {
            return null
        }
    }
    async findUserByDeviceId(deviceId: string): Promise<UserAccountDBClass | null> {
        let user = await UsersAccountModelClass.findOne({ userDevicesData: {$elemMatch: {deviceId: deviceId}}})
        if (user) {
            return user
        } else {
            return null
        }
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne(({$or: [{email: loginOrEmail}, {login: loginOrEmail}]}));
    }
    async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({"emailConfirmation.confirmationCode": emailConfirmationCode});
    }
    async findUserByRecoveryCode(recoveryCode: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({"emailRecoveryCode.recoveryCode": recoveryCode});
    }

}



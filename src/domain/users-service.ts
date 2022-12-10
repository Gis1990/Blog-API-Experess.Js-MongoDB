import {UserDBClassPagination,UserAccountDBClass} from "../types/types";
import {UsersRepository} from "../repositories/users-repository";





export class  UsersService  {
    constructor(protected usersRepository: UsersRepository) {}
    async getAllUsers (obj: {searchLoginTerm?:string|null,searchEmailTerm?:string|null, pageNumber?: number, pageSize?: number,sortBy?:string,sortDirection?:string }): Promise<UserDBClassPagination>  {
        const {searchLoginTerm=null,searchEmailTerm=null,pageNumber=1,pageSize=10,sortBy="createdAt",sortDirection="desc"}=obj
        return this.usersRepository.getAllUsers(searchLoginTerm,searchEmailTerm,Number(pageNumber),Number(pageSize),sortBy,sortDirection)
    }
    async findUserById(id: string): Promise<UserAccountDBClass | null> {
        return this.usersRepository.findUserById(id)
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBClass | null> {
        return this.usersRepository.findByLoginOrEmail(loginOrEmail)
    }
    async deleteUser(userId: string): Promise<boolean>  {
        return this.usersRepository.deleteUserById(userId)
    }
    async updateConfirmationCode(id: string): Promise<boolean> {
        return  this.usersRepository.updateConfirmationCode(id)
    }
}



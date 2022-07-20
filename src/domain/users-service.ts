import {UserDBTypePagination,UserAccountDBType} from "../repositories/types";
import {usersRepository} from "../repositories/users-repository";


export const usersService = {
    async getAllUsers (obj: { PageNumber?: number, PageSize?: number }): Promise<UserDBTypePagination>  {
        const {PageNumber=1,PageSize=10}=obj
        return usersRepository.getAllUsers(Number(PageNumber),Number(PageSize))
    },
    async findUserById(id: string): Promise<UserAccountDBType | null> {
        return usersRepository.findUserById(id)
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBType | null> {
        return usersRepository.findByLoginOrEmail(loginOrEmail)
    },
    async deleteUser(userId: string): Promise<boolean>  {
        return usersRepository.deleteUserById(userId)
    },
}
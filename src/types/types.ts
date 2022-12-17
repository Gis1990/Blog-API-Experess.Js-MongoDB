import {ObjectId} from 'mongodb'

export class BlogDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date,
    ) {
    }
}

export class NewBlogClassResponseModel {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date
    ) {
    }
}

export class queryAllBlogsClass {
    constructor(
        public searchNameTerm: string,
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: string,
    ) {}
}

export class queryAllUsersClass {
    constructor(
        public searchLoginTerm: string,
        public searchEmailTerm: string,
        public pageNumber: number,
        public pageSize: number,
        public sortBy: string,
        public sortDirection: string,
    ) {}
}




export class CommentDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public postId: string,
        public createdAt: string,
        public likesInfo: LikesInfoClass,
        public usersLikesInfo: UsersLikesInfoClass
    ) {
    }
}


export class NewCommentClassResponseModel {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: string,
        public likesInfo: LikesInfoClass,
    ) {
    }
}







export class PostDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
        public usersLikesInfo: UsersLikesInfoClass,
    ) {
    }
}





export type ErrorType={
    message: string
    field: string
}



export class BlogDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: BlogDBClass[]
    ) {
    }
}

export class PostDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostDBClass[]
    ) {
    }
}


export class CommentDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentDBClass[]
    ) {
    }
}



export class UserDBClassPagination {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: UserAccountDBClass[]
    ) {
    }
}


export class UserAccountDBClass {
    constructor(
        public _id: ObjectId,
        public id: string,
        public login: string,
        public email: string,
        public passwordHash: string,
        public createdAt: string,
        public emailRecoveryCode: UserRecoveryCodeClass,
        public loginAttempts: LoginAttemptsClass[],
        public emailConfirmation: UserAccountEmailClass,
        public userDevicesData: userDevicesDataClass[]
    ) {
    }
}


export class UserRecoveryCodeClass {
    constructor(
        public recoveryCode: string,
        public expirationDate: Date,
    ) {
    }
}



export class userDevicesDataClass {
    constructor(
        public ip: string,
        public lastActiveDate: Date,
        public deviceId: string,
        public title: string|undefined
    ) {
    }
}


export class UserAccountEmailClass {
    constructor(
        public sentEmails: SentEmailsClass[],
        public confirmationCode: string,
        public expirationDate: Date,
        public isConfirmed: boolean
    ) {
    }
}

export class NewUserClassResponseModel {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string,
    ) {
    }
}


export class NewPostClassResponseModel {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
    ) {
    }
}




export class LoginAttemptsClass {
    constructor(
        public attemptDate: Date,
        public ip: string) {
    }
}

export class RefreshTokenClass {
    constructor(public token: string) {
    }
}


export class SentEmailsClass {
    constructor(public sentDate: string) {
    }
}

export class ExtendedLikesInfoClass {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: string,
        public newestLikes: NewestLikesClass[]
    ) {
    }
}

export class UsersLikesInfoClass {
    constructor(
        public usersWhoPutLike: string[],
        public usersWhoPutDislike: string[],

    ) {
    }
}





export class NewestLikesClass {
    constructor(
        public addedAt: Date,
        public userId: string,
        public login: string
    ) {
    }
}


export class LikesInfoClass {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: string
    ) {
    }
}




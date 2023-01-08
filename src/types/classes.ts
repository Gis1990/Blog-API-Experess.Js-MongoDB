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

export class BlogViewModelClass {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: Date
    ) {
    }
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
    returnUsersLikeStatusForComment(userId: string | undefined): CommentDBClass {
        if (userId) {
            this.likesInfo.myStatus = this.getLikesDataInfoForComment(userId);
        } else {
            this.likesInfo.myStatus = "None";
        }
        return this;
    }

    getLikesDataInfoForComment(userId: string): string {
        const isLiked = this.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = this.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
    }
}


export class CommentViewModelClass {
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

    returnUsersLikeStatusForPost(userId: string | undefined): PostDBClass {
        this.extendedLikesInfo.newestLikes = this.extendedLikesInfo.newestLikes
            .slice(-3)
            .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
        if (userId) {
            this.extendedLikesInfo.myStatus = this.getLikesDataInfoForPost(userId);
        } else {
            this.extendedLikesInfo.myStatus = "None";
        }
        return this;
    }

    getLikesDataInfoForPost(userId: string): string {

        const isLiked = this.usersLikesInfo.usersWhoPutLike.includes(userId);
        const isDisliked = this.usersLikesInfo.usersWhoPutDislike.includes(userId);

        if (isLiked) {
            return "Like";
        }

        if (isDisliked) {
            return "Dislike";
        }

        return "None";
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

export class PostDBPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostViewModelClass[]
    ) {
    }
}


export class CommentDBPaginationClass {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentViewModelClass[]
    ) {
    }
}



export class UserDBPaginationClass {
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
        public userDevicesData: UserDevicesDataClass[]
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



export class UserDevicesDataClass {
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

export class NewUserViewModel {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string,
    ) {
    }
}


export class PostViewModelClass {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: Date,
        public extendedLikesInfo: ExtendedLikesInfoClass,
    ) {
    }
}




export class LoginAttemptsClass {
    constructor(
        public attemptDate: Date,
        public ip: string) {
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



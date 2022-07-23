import { WithId} from 'mongodb'


export type ErrorType={
    message: string
    field: string
}

export type PostDBType=WithId<{
    id:string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}>

export type BloggerDBType=WithId< {
    id:string
    name: string
    youtubeUrl: string
}>

export type CommentDBType=WithId<{
    id:string
    content: string
    userId: string
    userLogin: string
    postId: string
    addedAt: string
}>


export type BloggerDBTypePagination={
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BloggerDBType[]
}

export type PostDBTypePagination ={
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostDBType[]
}

export type CommentDBTypePagination ={
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentDBType[]
}


export type UserDBTypePagination ={
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: {id:string,login:string}[]
}

export type UserAccountDBType = WithId<{
    accountData: UserAccountType,
    loginAttempts: LoginAttemptType[],
    emailConfirmation: EmailConfirmationType
    blacklistedRefreshTokens: RefreshTokenType[]
}>


export type UserAccountType = {
    id:string
    login: string
    email: string
    passwordHash: string
    createdAt: Date
}

export type SentConfirmationEmailType = {
    sentDate: Date
}

export type LoginAttemptType = {
    attemptDate: Date
    ip: string
}

export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationDate: Date
    sentEmails: SentConfirmationEmailType[]
}

export type getNewUserAccountType = {
    id: string
    login: string
    email: string
    emailConfirmation: EmailConfirmationType
}

export type RefreshTokenType = {
    token: string
}

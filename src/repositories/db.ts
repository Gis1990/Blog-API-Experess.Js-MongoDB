import {settings} from "../settings";
import mongoose from 'mongoose';
import {
    BloggerDBClass,
    CommentDBClass,
    PostDBClass,
    UserAccountDBClass,
    RefreshTokenClass,
    SentEmailsClass,
    LoginAttemptsClass,
    NewestLikesClass
} from "./types";
require('dotenv').config()

const bloggersSchema = new mongoose.Schema<BloggerDBClass>({
    id:String,
    name: String,
    youtubeUrl: String
}, {
    versionKey: false
});

const newestLikesSchema = new mongoose.Schema<NewestLikesClass>({
    addedAt: Date,
    userId: String,
    login: String
}, { _id : false })


const postsSchema = new mongoose.Schema<PostDBClass>({
    id:String,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String,
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes:[newestLikesSchema]
    },
    usersLikesInfo: {
        usersWhoPutLike: [String],
        usersWhoPutDislike: [String]
    }
    },{versionKey: false}
);

const loginAttemptsSchema = new mongoose.Schema<LoginAttemptsClass>({
    attemptDate: String,
    ip: String
}, { _id : false })

const sentEmailsSchema = new mongoose.Schema<SentEmailsClass>({
    sentDate: String
}, { _id : false })

const blacklistedRefreshTokensSchema = new mongoose.Schema<RefreshTokenClass>({
    token: String
}, { _id : false })



const usersAccountSchema = new mongoose.Schema<UserAccountDBClass>({
    id:String,
    login: String,
    email: String,
    passwordHash: String,
    createdAt: String,
    loginAttempts: [loginAttemptsSchema],
    emailConfirmation: {
        isConfirmed: Boolean,
        confirmationCode: String,
        expirationDate: Date,
        sentEmails: [sentEmailsSchema]
    },
    blacklistedRefreshTokens: [blacklistedRefreshTokensSchema]
},{
    versionKey: false
})


const commentsSchema = new mongoose.Schema<CommentDBClass>({
    id:String,
    content: String,
    userId: String,
    userLogin: String,
    postId: String,
    addedAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
    }
},{
    versionKey: false
});


export const BloggersModelClass = mongoose.model('bloggers', bloggersSchema);
export const PostsModelClass = mongoose.model('posts', postsSchema);
export const UsersAccountModelClass = mongoose.model('users', usersAccountSchema);
export const CommentsModelClass = mongoose.model('comments', commentsSchema);



export async function runDb ( ) {
  try {
    await mongoose.connect(settings.mongo_URI);
    console.log ( "Connected successfully to mongo server" ) ;
  } catch {
      console.log("Error connecting to mongo server")
      await mongoose.disconnect() ;
  }
}
import {settings} from "../settings";
import mongoose from 'mongoose';
import {
    BloggerDBType,
    CommentDBType, LoginAttemptType,
    PostDBType, SentConfirmationEmailType, UserAccountDBType,
} from "./types";
require('dotenv').config()

const bloggersSchema = new mongoose.Schema<BloggerDBType>({
    id:String,
    name: String,
    youtubeUrl: String
}, {
    versionKey: false
});

const postsSchema = new mongoose.Schema<PostDBType>({
    id:String,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String
},{
    versionKey: false
});

const loginAttemptsSchema = new mongoose.Schema<LoginAttemptType>({
    attemptDate: Date,
    ip: String
}, { _id : false })

const sentEmailsSchema = new mongoose.Schema<SentConfirmationEmailType>({
    sentDate: Date
}, { _id : false })


const usersAccountSchema = new mongoose.Schema<UserAccountDBType>({
    accountData: {
        id:String,
        login: String,
        email: String,
        passwordHash: String,
        createdAt: Date
    },
    loginAttempts: [loginAttemptsSchema],
    emailConfirmation: {
        isConfirmed: Boolean,
        confirmationCode: String,
        expirationDate: Date,
        sentEmails: [sentEmailsSchema]
    }
},{
    versionKey: false
})


const commentsSchema = new mongoose.Schema<CommentDBType>({
    id:String,
    content: String,
    userId: String,
    userLogin: String,
    postId: String,
    addedAt: String
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
import {settings} from "../settings";
import mongoose from 'mongoose';
import {
    BloggerDBType,
    CommentDBType,
    PostDBType, UserAccountDBType,
} from "./types";
require('dotenv').config()

const bloggersSchema = new mongoose.Schema<BloggerDBType>({
    id:String,
    name: String,
    youtubeUrl: String
});

const postsSchema = new mongoose.Schema<PostDBType>({
    id:String,
    title: String,
    shortDescription: String,
    content: String,
    bloggerId: String,
    bloggerName: String
});

const usersAccountSchema = new mongoose.Schema<UserAccountDBType>({
    accountData: {
        id:String,
        login: String,
        email: String,
        passwordHash: String,
        createdAt: Date
    },
    loginAttempts: [{
        attemptDate: Date,
        ip: String
    }],
    emailConfirmation: {
        isConfirmed: Boolean,
        confirmationCode: String,
        expirationDate: Date,
        sentEmails: [{sentDate: Date}]
    }
});


const commentsSchema = new mongoose.Schema<CommentDBType>({
    id:String,
    content: String,
    userId: String,
    userLogin: String,
    postId: String,
    addedAt: String
})

export const BloggersModel = mongoose.model('bloggers', bloggersSchema);
export const PostsModel = mongoose.model('posts', postsSchema);
export const UsersAccountModel = mongoose.model('users', usersAccountSchema);
export const CommentsModel = mongoose.model('comments', commentsSchema);



export async function runDb ( ) {
  try {
    await mongoose.connect(settings.mongo_URI);
    console.log ( "Connected successfully to mongo server" ) ;
  } catch {
      console.log("Error connecting to mongo server")
      await mongoose.disconnect() ;
  }
}
import {settings} from "../settings";
import mongoose from 'mongoose';
import {
    BlogDBClass,
    CommentDBClass,
    PostDBClass,
    UserAccountDBClass,
    SentEmailsClass,
    LoginAttemptsClass,
    NewestLikesClass, UserDevicesDataClass,
} from "../classes/classes";
require('dotenv').config()

const blogsSchema = new mongoose.Schema<BlogDBClass>({
    id:String,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: Date,
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
    blogId: String,
    blogName: String,
    createdAt: Date,
        extendedLikesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes:[newestLikesSchema]
        },
        usersLikesInfo: {
            usersWhoPutLike: [String],
            usersWhoPutDislike: [String]
        },
    },
    {versionKey: false},
);

postsSchema.methods.returnUsersLikeStatusForPost = function( userId: string | undefined): PostDBClass {
    this.extendedLikesInfo.newestLikes = this.extendedLikesInfo.newestLikes
        .slice(-3)
        .sort((a: { addedAt: { getTime: () => number; }; }, b: { addedAt: { getTime: () => number; }; }) => b.addedAt.getTime() - a.addedAt.getTime());
    if (userId) {
        this.extendedLikesInfo.myStatus = this.getLikesDataInfoForPost(userId);
    } else {
        this.extendedLikesInfo.myStatus = "None";
    }
    return <PostDBClass>this;
};

postsSchema.methods.getLikesDataInfoForPost=function(userId: string): string {
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




const loginAttemptsSchema = new mongoose.Schema<LoginAttemptsClass>({
    attemptDate: String,
    ip: String
}, { _id : false })

const sentEmailsSchema = new mongoose.Schema<SentEmailsClass>({
    sentDate: String
}, { _id : false })



const userDevicesDataSchema = new mongoose.Schema<UserDevicesDataClass>({
    ip: String,
    lastActiveDate: Date,
    deviceId: String,
    title: String
}, { _id : false })

const usersAccountSchema = new mongoose.Schema<UserAccountDBClass>({
    id:String,
    login: String,
    email: String,
    passwordHash: String,
    createdAt: String,
    emailRecoveryCode: {
        recoveryCode: String,
        expirationDate: Date,
    },
    loginAttempts: [loginAttemptsSchema],
    emailConfirmation: {
        isConfirmed: Boolean,
        confirmationCode: String,
        expirationDate: Date,
        sentEmails: [sentEmailsSchema]
    },
    userDevicesData: [userDevicesDataSchema]
},{
    versionKey: false
})



const commentsSchema = new mongoose.Schema<CommentDBClass>({
    id:String,
    content: String,
    userId: String,
    userLogin: String,
    postId: String,
    createdAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String
    },
    usersLikesInfo: {
        usersWhoPutLike: [String],
        usersWhoPutDislike: [String]
    }
},{
    versionKey: false
});

commentsSchema.methods.returnUsersLikeStatusForComment = function( userId: string | undefined): CommentDBClass {
    if (userId) {
        this.likesInfo.myStatus = this.getLikesDataInfoForComment(userId);
    } else {
        this.likesInfo.myStatus = "None";
    }
    return <CommentDBClass>this;
};

commentsSchema.methods.getLikesDataInfoForComment=function(userId: string): string {
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



export const BlogsModelClass = mongoose.model('blogs', blogsSchema);
export const PostsModelClass = mongoose.model('posts', postsSchema);
export const UsersAccountModelClass = mongoose.model('users', usersAccountSchema);
export const CommentsModelClass = mongoose.model('comments', commentsSchema);

// postsSchema.methods = {
//     getLikesDataInfoForPost: PostDBClass.prototype.getLikesDataInfoForPost,
//     returnUsersLikeStatusForPost: PostDBClass.prototype.returnUsersLikeStatusForPost,
// };
//
// commentsSchema.methods = {
//     getLikesDataInfoForPost: PostDBClass.prototype.getLikesDataInfoForPost,
//     returnUsersLikeStatus: PostDBClass.prototype.returnUsersLikeStatusForPost,
// };


export async function runDb () {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(settings.mongo_URI);
    console.log ( "Connected successfully to mongo server" ) ;
  } catch {
      console.log("Error connecting to mongo server")
      await mongoose.disconnect() ;
  }
}



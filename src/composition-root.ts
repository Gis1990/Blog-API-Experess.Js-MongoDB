import "reflect-metadata";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsController} from "./controllers/blogs-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsController} from "./controllers/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {UsersRepository} from "./repositories/users-repository";
import {UsersController} from "./controllers/users-controller";
import {EmailAdapter} from "./application/email-adapter";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controllers/auth-controller";
import {JwtService} from "./application/jwt-service";
import {AuthAccessTokenController} from "./middlewares/authentication-middleware";
import {SecurityController} from "./controllers/security-controller";
import {BlogsQueryRepository} from "./repositories/blogs-query-repository";
import {CommentsQueryRepository} from "./repositories/comments-query-repository";
import {PostsQueryRepository} from "./repositories/posts-query-repository";
import {UsersQueryRepository} from "./repositories/users-query-repository";
import {Container} from "inversify";
import {PostsQueryService} from "./domain/posts-query-service";
import {CreateBlogUseCase} from "./domain/use-cases/blogs/create-blog-use-case";
import {UpdateBlogUseCase} from "./domain/use-cases/blogs/update-blog-use-case";
import {DeleteBlogUseCase} from "./domain/use-cases/blogs/delete-blog-use-case";
import {CreatePostUseCase} from "./domain/use-cases/posts/create-post-use-case";
import {DeletePostUseCase} from "./domain/use-cases/posts/delete-post-use-case";
import {LikeOperationForPostUseCase} from "./domain/use-cases/posts/like-operation-for-post-use-case";
import {UpdatePostUseCase} from "./domain/use-cases/posts/update-post-use-case";
import {AuthCredentialsCheckUseCase} from "./domain/use-cases/security/auth-credentials-check-use-case";
import {CheckAccessRightsUseCase} from "./domain/use-cases/security/check-access-rights-use-case";
import {ReturnAllDevicesUseCase} from "./domain/use-cases/security/return-all-devices-use-case";
import {TerminateAllDevicesUseCase} from "./domain/use-cases/security/terminate-all-devices-use-case";
import {TerminateSpecificDeviceUseCase} from "./domain/use-cases/security/terminate-specific-device-use-case";
import {UpdateCommentUseCase} from "./domain/use-cases/comments/update-comment-use-case";
import {LikeOperationForCommentUseCase} from "./domain/use-cases/comments/like-operation-for-comment-use-case";
import {CreateCommentUseCase} from "./domain/use-cases/comments/create-comment-use-case";
import {DeleteCommentUseCase} from "./domain/use-cases/comments/delete-comment-use-case";
import {DeleteUserUseCase} from "./domain/use-cases/users/delete-user-use-case";
import {AcceptNewPasswordUseCase} from "./domain/use-cases/auth/accept-new-password-use-case";
import {CheckCredentialsUseCase} from "./domain/use-cases/auth/check-credentials-use-case";
import {ConfirmEmailUseCase} from "./domain/use-cases/auth/confirm-email-use-case";
import {
    CreateUserWithConfirmationEmailUseCase
} from "./domain/use-cases/auth/create-user-with-confirmation-email-use-case";
import {
    CreateUserWithoutConfirmationEmailUseCase
} from "./domain/use-cases/auth/create-user-without-confirmation-email-use-case";
import {PasswordRecoveryUseCase} from "./domain/use-cases/auth/password-recovery-use-case";
import {RefreshAllTokensUseCase} from "./domain/use-cases/auth/refresh-all-tokens-use-case";
import {RefreshOnlyRefreshTokenUseCase} from "./domain/use-cases/auth/refresh-only-refresh-token-use-case";
import {RegistrationEmailResendingUseCase} from "./domain/use-cases/auth/registration-email-resending-use-case";




export const container = new Container();
//blogs
container.bind(BlogsController).to(BlogsController).inSingletonScope();
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository).inSingletonScope();
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository).inSingletonScope();
//blogs use cases
container.bind<CreateBlogUseCase>(CreateBlogUseCase).to(CreateBlogUseCase).inSingletonScope();
container.bind<UpdateBlogUseCase>(UpdateBlogUseCase).to(UpdateBlogUseCase).inSingletonScope();
container.bind<DeleteBlogUseCase>(DeleteBlogUseCase).to(DeleteBlogUseCase).inSingletonScope();
//posts
container.bind(PostsController).to(PostsController).inSingletonScope();
container.bind<PostsQueryService>(PostsQueryService).to(PostsQueryService).inSingletonScope();
container.bind<PostsRepository>(PostsRepository).to(PostsRepository).inSingletonScope();
container.bind<PostsQueryRepository>(PostsQueryRepository).to(PostsQueryRepository).inSingletonScope();
//posts use cases
container.bind<CreatePostUseCase>(CreatePostUseCase).to(CreatePostUseCase).inSingletonScope();
container.bind<DeletePostUseCase>(DeletePostUseCase).to(DeletePostUseCase).inSingletonScope();
container.bind<LikeOperationForPostUseCase>(LikeOperationForPostUseCase).to(LikeOperationForPostUseCase).inSingletonScope();
container.bind<UpdatePostUseCase>(UpdatePostUseCase).to(UpdatePostUseCase).inSingletonScope();
// comments
container.bind(CommentsController).to(CommentsController).inSingletonScope();
container.bind<CommentsService>(CommentsService).to(CommentsService).inSingletonScope();
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository).inSingletonScope();
container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository).inSingletonScope();
//comments use cases
container.bind<CreateCommentUseCase>(CreateCommentUseCase).to(CreateCommentUseCase).inSingletonScope();
container.bind<DeleteCommentUseCase>(DeleteCommentUseCase).to(DeleteCommentUseCase).inSingletonScope();
container.bind<LikeOperationForCommentUseCase>(LikeOperationForCommentUseCase).to(LikeOperationForCommentUseCase).inSingletonScope();
container.bind<UpdateCommentUseCase>(UpdateCommentUseCase).to(UpdateCommentUseCase).inSingletonScope();

//users
container.bind(UsersController).to(UsersController).inSingletonScope();
container.bind<UsersRepository>(UsersRepository).to(UsersRepository).inSingletonScope();
container.bind<UsersQueryRepository>(UsersQueryRepository).to(UsersQueryRepository).inSingletonScope();
//users use cases
container.bind<DeleteUserUseCase>(DeleteUserUseCase).to(DeleteUserUseCase).inSingletonScope();
//auth
container.bind(AuthController).to(AuthController).inSingletonScope();
container.bind<AuthService>(AuthService).to(AuthService).inSingletonScope();
//auth use cases
container.bind<AcceptNewPasswordUseCase>(AcceptNewPasswordUseCase).to(AcceptNewPasswordUseCase).inSingletonScope();
container.bind<CheckCredentialsUseCase>(CheckCredentialsUseCase).to(CheckCredentialsUseCase).inSingletonScope();
container.bind<ConfirmEmailUseCase>(ConfirmEmailUseCase).to(ConfirmEmailUseCase).inSingletonScope();
container.bind<CreateUserWithConfirmationEmailUseCase>(CreateUserWithConfirmationEmailUseCase).to(CreateUserWithConfirmationEmailUseCase).inSingletonScope();
container.bind<CreateUserWithoutConfirmationEmailUseCase>(CreateUserWithoutConfirmationEmailUseCase).to(CreateUserWithoutConfirmationEmailUseCase).inSingletonScope();
container.bind<PasswordRecoveryUseCase>(PasswordRecoveryUseCase).to(PasswordRecoveryUseCase).inSingletonScope();
container.bind<RefreshAllTokensUseCase>(RefreshAllTokensUseCase).to(RefreshAllTokensUseCase).inSingletonScope();
container.bind<RefreshOnlyRefreshTokenUseCase>(RefreshOnlyRefreshTokenUseCase).to(RefreshOnlyRefreshTokenUseCase).inSingletonScope();
container.bind<RegistrationEmailResendingUseCase>(RegistrationEmailResendingUseCase).to(RegistrationEmailResendingUseCase).inSingletonScope();
//security
container.bind(SecurityController).to(SecurityController).inSingletonScope();
//security use cases
container.bind<AuthCredentialsCheckUseCase>(AuthCredentialsCheckUseCase).to(AuthCredentialsCheckUseCase).inSingletonScope()
container.bind<CheckAccessRightsUseCase>(CheckAccessRightsUseCase).to(CheckAccessRightsUseCase).inSingletonScope();
container.bind<ReturnAllDevicesUseCase>(ReturnAllDevicesUseCase).to(ReturnAllDevicesUseCase).inSingletonScope();
container.bind<TerminateAllDevicesUseCase>(TerminateAllDevicesUseCase).to(TerminateAllDevicesUseCase).inSingletonScope();
container.bind<TerminateSpecificDeviceUseCase>(TerminateSpecificDeviceUseCase).to(TerminateSpecificDeviceUseCase).inSingletonScope();
//jwt
container.bind<JwtService>(JwtService).to(JwtService).inSingletonScope();
//email
container.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter).inSingletonScope();


export const blogsController = container.resolve (BlogsController)
export const postsController = container.resolve (PostsController)
export const commentsController = container.resolve (CommentsController)
export const usersController = container.resolve (UsersController)
export const authController = container.resolve (AuthController)
export const securityController = container.resolve (SecurityController)
export const authAccessTokenController = container.resolve (AuthAccessTokenController)





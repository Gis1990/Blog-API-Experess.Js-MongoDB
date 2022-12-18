import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controllers/blogs-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controllers/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {UsersService} from "./domain/users-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersController} from "./controllers/users-controller";
import {EmailAdapter} from "./application/email-adapter";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controllers/auth-controller";
import {JwtService} from "./application/jwt-service";
import {AuthAccessTokenController} from "./middlewares/authentication-middleware";
import {SecurityController} from "./controllers/security-controller";
import {SecurityService} from "./domain/security-service";
import {BlogsQueryRepository} from "./repositories/blogs-query-repository";
import {CommentsQueryRepository} from "./repositories/comments-query-repository";
import {PostsQueryRepository} from "./repositories/posts-query-repository";
import {PostsQueryService} from "./domain/posts-query-service";
import {UsersQueryRepository} from "./repositories/users-query-repository";


export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();
const blogsRepository = new BlogsRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();
const commentsRepository = new CommentsRepository()
export const commentsQueryRepository = new CommentsQueryRepository()
const blogsService = new BlogsService(blogsRepository);
const postsService = new PostsService(postsRepository,blogsQueryRepository,postsQueryRepository);
const postsQueryService = new PostsQueryService(postsQueryRepository,blogsQueryRepository);
const commentsService = new CommentsService(commentsRepository,commentsQueryRepository);
const jwtService = new JwtService()
export const usersService = new UsersService(usersRepository);
const emailController = new EmailAdapter();
const authService= new AuthService(usersRepository,usersQueryRepository,emailController,usersService,jwtService);
const securityService= new SecurityService(usersRepository,jwtService,usersQueryRepository);





export const blogsController = new BlogsController(blogsService,blogsQueryRepository);
export const postsController = new PostsController(postsService,postsQueryService);
export const commentsController = new CommentsController(commentsService);
export const usersController = new UsersController(usersService,authService,usersQueryRepository);
export const authController = new AuthController(authService);
export const securityController = new SecurityController(securityService);
export const authAccessTokenController = new AuthAccessTokenController(usersQueryRepository,jwtService);



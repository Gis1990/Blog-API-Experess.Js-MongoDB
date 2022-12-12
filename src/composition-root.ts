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


export const usersRepository = new UsersRepository();
const blogsRepository = new BlogsRepository();
const postsRepository = new PostsRepository();
const commentsRepository = new CommentsRepository()
const blogsService = new BlogsService(blogsRepository);
const postsService = new PostsService(postsRepository,blogsRepository);
const commentsService = new CommentsService(commentsRepository);
const jwtService = new JwtService()
export const usersService = new UsersService(usersRepository);
const emailController = new EmailAdapter();
const authService= new AuthService(usersRepository,emailController,usersService,jwtService);
const securityService= new SecurityService(usersRepository,jwtService);





export const blogsController = new BlogsController(blogsService);
export const postsController = new PostsController(postsService);
export const commentsController = new CommentsController(commentsService);
export const usersController = new UsersController(usersService,authService);
export const authController = new AuthController(authService);
export const securityController = new SecurityController(securityService);
export const authAccessTokenController = new AuthAccessTokenController(usersService,jwtService);



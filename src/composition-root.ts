import {BloggersRepository} from "./repositories/bloggers-repository";
import {BloggersService} from "./domain/bloggers-service";
import {BloggersController} from "./controllers/bloggers-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controllers/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {UsersService} from "./domain/users-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersController} from "./controllers/users-controller";
import {EmailController} from "./controllers/email-controller";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controllers/auth-controller";
import {JwtService} from "./application/jwt-service";
import {AuthAccessTokenController} from "./middlewares/authentication-middleware";
import {QuizController} from "./controllers/pair-game-quiz-controller";
import {QuizRepository} from "./repositories/pair-game-quiz-repository";
import {QuizService} from "./domain/pair-game-quiz-service";


export const usersRepository = new UsersRepository();
const bloggersRepository = new BloggersRepository();
const postsRepository = new PostsRepository();
const commentsRepository = new CommentsRepository()
const quizRepository = new QuizRepository();
const bloggersService = new BloggersService(bloggersRepository);
const postsService = new PostsService(postsRepository,bloggersRepository);
const commentsService = new CommentsService(commentsRepository);
const jwtService = new JwtService()
const quizService = new QuizService(quizRepository);
export const usersService = new UsersService(usersRepository);
const emailController = new EmailController();
const authService= new AuthService(usersRepository,emailController,usersService,jwtService);





export const bloggersController = new BloggersController(bloggersService);
export const postsController = new PostsController(postsService);
export const commentsController = new CommentsController(commentsService);
export const usersController = new UsersController(usersService,authService);
export const authController = new AuthController(authService);
export const authAccessTokenController = new AuthAccessTokenController(usersService,jwtService);
export const quizController = new QuizController(quizService);


import {NextFunction, Request, Response} from "express";
import {validationResult, Schema, param, ValidationChain, checkSchema} from "express-validator";
import {ErrorType} from "../repositories/types";
import {BloggersModelClass, CommentsModelClass, PostsModelClass, UsersAccountModelClass} from "../repositories/db";
import {usersService} from "../composition-root";
import {usersRepository} from "../composition-root";


const pattern=/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
const patternForEmail=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


export const bloggersValidationSchema:Schema = {
    name: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field Name is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field Name is required."
        },
        isLength: {
            options: {max: 15},
            errorMessage: "The field Name has invalid length",
        }
    },
    youtubeUrl: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field YoutubeUrl is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field YoutubeUrl is required."
        },
        isLength: {
            options: {max: 100},
            errorMessage: "The field YoutubeUrl has invalid length",
        },
        matches: {
            options: pattern,
            errorMessage: 'The field YoutubeUrl has incorrect format'
        }
    },
}


export const validationSchemaForPosts:Schema = {
    title: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field Title is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field Title is required."
        },
        isLength: {
            options: {max: 30},
            errorMessage: "The field Title has invalid length",
        }
    },
    shortDescription: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field shortDescription is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field shortDescription is required."
        },
        isLength: {
            options: {max: 100},
            errorMessage: "The field shortDescription has invalid length",
        }
    },
    content: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field content is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field content is required."
        },
        isLength: {
            options: {max: 1000},
            errorMessage: "The field content has invalid length",
        }
    }
}


export const validationSchemaForPostsWithExtendedData:Schema = {
    title: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field Title is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field Title is required."
        },
        isLength: {
            options: {max: 30},
            errorMessage: "The field Title has invalid length",
        }
    },
    shortDescription: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field shortDescription is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field shortDescription is required."
        },
        isLength: {
            options: {max: 100},
            errorMessage: "The field shortDescription has invalid length",
        }
    },
    content: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field content is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field content is required."
        },
        isLength: {
            options: {max: 1000},
            errorMessage: "The field content has invalid length",
        }
    },
    bloggerId: {
        in: ["query","body","params"],
        exists: {
            errorMessage: "The field bloggerId is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field bloggerId is required."
        },
        isString: {
            errorMessage: "The field bloggerId must be a string.",
        },
        custom: {
            options: async(id) => {
                const blogger = await BloggersModelClass.findOne({id: id})
                return (!!blogger)?Promise.resolve():Promise.reject()
            },
            errorMessage: "The field bloggerId does not exist"
        }
    }
}




export const validationSchemaForUsers:Schema = {
    login: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field login is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field login is required."
        },
        isLength: {
            options: {min:3,max: 10},
            errorMessage: "The field login has invalid length",
        },
        custom: {
            options: async(login) => {
                const user =  await usersService.findByLoginOrEmail(login)
                return (!user)?Promise.resolve():Promise.reject()
            },
            errorMessage: "Login is already exist"
        }
    },
    email: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field email is required."
        },
        notEmpty: {
            errorMessage: "The field email is required."
        },
        matches: {
            options: patternForEmail,
            errorMessage: 'The field email has incorrect format'
        },
        custom: {
            options: async(email) => {
                const user =  await usersService.findByLoginOrEmail(email)
                return (!user)?Promise.resolve():Promise.reject()
            },
            errorMessage: "Email is already exist in database"
        }
    },
    password: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field password is required."
        },
        notEmpty: {
            errorMessage: "The field password is required."
        },
        isLength: {
            options: {min:6,max: 20},
            errorMessage: "The field password has invalid length",
        },
    },
}

export const validationSchemaForEmails:Schema = {
    email: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field email is required."
        },
        notEmpty: {
            errorMessage: "The field email is required."
        },
        matches: {
            options: patternForEmail,
            errorMessage: 'The field email has incorrect format'
        },
        custom: {
            options: async(email) => {
                const user =  await usersService.findByLoginOrEmail(email)
                if (!user) {
                    return Promise.reject()
                }
                if (user?.emailConfirmation.isConfirmed) {
                    return Promise.reject()
                }else{
                    return Promise.resolve()
                }
            },
            errorMessage: "Email is already confirmed or doesn't exist in database"

        },

    }
}



export const validationSchemaForConfirmationCodes:Schema = {
    code: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field code is required."
        },
        notEmpty: {
            errorMessage: "The field code is required."
        },
        custom: {
            options: async(code) => {
                const user =  await usersRepository.findUserByConfirmationCode(code)
                if (!user) {
                    return Promise.reject()
                }
                if (user?.emailConfirmation.isConfirmed) {
                    return Promise.reject()
                }else{
                    return Promise.resolve()
                }
            },
            errorMessage: "Code doesn't exist in database or is already confirmed"
        },
    },

}





export const validationSchemaForComments:Schema = {
    content: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field content is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field content is required."
        },
        isLength: {
            options: {min:20,max: 300},
            errorMessage: "The field content has invalid length",
        }
    }
}


export const validationSchemaForLogins:Schema = {
    login: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field login is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field login is required."
        }
    },
    password: {
        in: ["query","body"],
        exists: {
            errorMessage: "The field password is required."
        },
        notEmpty: {
            errorMessage: "The field password is required."
        }
    },
}


export const validationSchemaForLikes:Schema = {
    likeStatus: {
        in: ["body"],
        exists: {
            errorMessage: "The field likeStatus is required."
        },
        trim:true,
        notEmpty: {
            errorMessage: "The field likeStatus is required."
        },
        isIn: {
            options: [["None", "Like", "Dislike"]],
            errorMessage: "Incorrect value of likeStatus"
        }
}}




const errorHandlerForIdValidation = (rq: Request, rs: Response, nxt: NextFunction) => {
    const errors = validationResult(rq)
    if (!errors.isEmpty()) {
        rs.sendStatus(404)
    } else {
        nxt()
    }
}



export const postsIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    await param("postId","Id is not exist").custom(async postId=>{
        const posts = await PostsModelClass.findOne({id: postId})
        return (!!posts)?Promise.resolve():Promise.reject()}).run(req)
    errorHandlerForIdValidation(req,res,next)
}


export const bloggersIdValidation = async (req: Request, res: Response, next: NextFunction) => {
         await param("bloggerId", "Id does not exist").custom(async bloggerId => {
            const blogger =await BloggersModelClass.findOne({id: bloggerId})
            return (!!blogger)?Promise.resolve():Promise.reject()}).run(req)
        errorHandlerForIdValidation(req,res,next)
}

export const usersIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    await param("userId", "Id does not exist").custom(async userId => {
        const user =await UsersAccountModelClass.findOne({id: userId})
        return (!!user)?Promise.resolve():Promise.reject()}).run(req)
    errorHandlerForIdValidation(req,res,next)
}

export const commentsIdValidation = async (req: Request, res: Response, next: NextFunction) => {
    await param("commentId", "Id does not exist").custom(async commentId => {
        const user =await CommentsModelClass.findOne({id: commentId})
        return (!!user)?Promise.resolve():Promise.reject()}).run(req)
    errorHandlerForIdValidation(req,res,next)
}




const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const err = validationResult(req)
        const errors:Array<ErrorType>= err.array({onlyFirstError:true}).map(elem=>{
            return {
                message:elem.msg,
                field:elem.param
            }
        })
        if (!err.isEmpty()) {
            res.status(400).json({"errorsMessages": errors})
        } else {
            next()
        }
    }}



export const bloggersInputValidation=validate(checkSchema(bloggersValidationSchema))
export const postsWithExtendedDataInputValidation=validate(checkSchema(validationSchemaForPostsWithExtendedData))
export const usersInputValidation=validate(checkSchema(validationSchemaForUsers))
export const commentsInputValidation=validate(checkSchema(validationSchemaForComments))
export const loginsInputValidation=validate(checkSchema(validationSchemaForLogins))
export const emailsInputValidation=validate(checkSchema(validationSchemaForEmails))
export const confirmationCodesValidation=validate(checkSchema(validationSchemaForConfirmationCodes))
export const postsInputValidation=validate(checkSchema(validationSchemaForPosts))
export const likesInputValidation=validate(checkSchema(validationSchemaForLikes))








import {RateLimiter} from "limiter";
import {NextFunction,Request,Response} from "express";



const limiterForRegistration = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterForRegistrationConfirmation = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterForEmailResending = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterForLogin = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterForPasswordRecovery= new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterForNewPassword= new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})






export const rateLimiterForRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForRegistration.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}

export const rateLimiterForPasswordRecovery = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForPasswordRecovery.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}

export const rateLimiterForNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForNewPassword.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}



export const rateLimiterForRegistrationConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForRegistrationConfirmation.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}


export const rateLimiterForEmailResending = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForEmailResending.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}


export const rateLimiterForLogin= async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForLogin.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}









import {RateLimiter} from "limiter";
import {NextFunction,Request,Response} from "express";

const limiterForRegistration = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterLimiterForRegistrationConfirmation = new RateLimiter({ tokensPerInterval: 4, interval: 10000,fireImmediately: true})
const limiterLimiterForEmailResending = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
const limiterLimiterForLogin = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})


export const rateLimiterForRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterForRegistration.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}



export const rateLimiterForRegistrationConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterLimiterForRegistrationConfirmation.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}


export const rateLimiterForEmailResending = async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterLimiterForEmailResending.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}


export const rateLimiterForLogin= async (req: Request, res: Response, next: NextFunction) => {
    const remainingRequests = await limiterLimiterForLogin.removeTokens(1);
    if (remainingRequests < 0) {
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
        res.end('429 Too Many Requests - your IP is being rate limited');
    } else {
        next()
    }
}









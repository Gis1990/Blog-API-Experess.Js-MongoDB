import {RateLimiter} from "limiter";
import {NextFunction,Request,Response} from "express";
import rateLimit from 'express-rate-limit'


// const limiterForRegistration = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
// // const limiterLimiterForRegistrationConfirmation = new RateLimiter({ tokensPerInterval: 1, interval: 10000,fireImmediately: true})
// const limiterLimiterForEmailResending = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})
// // const limiterLimiterForLogin = new RateLimiter({ tokensPerInterval: 5, interval: 10000,fireImmediately: true})


export const rateLimiterForRegistration = rateLimit({
    windowMs: 10  * 1000, // 10 seconds
    max: 5, // Limit each IP to 100 requests per `window` (here, per 10 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const rateLimiterForRegistrationConfirmation = rateLimit({
    windowMs: 10  * 1000, // 10 seconds
    max: 5, // Limit each IP to 100 requests per `window` (here, per 10 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const rateLimiterForEmailResending = rateLimit({
    windowMs: 10  * 1000, // 10 seconds
    max: 5, // Limit each IP to 100 requests per `window` (here, per 10 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const rateLimiterForLogin = rateLimit({
    windowMs: 10  * 1000, // 10 seconds
    max: 5, // Limit each IP to 100 requests per `window` (here, per 10 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})





// export const rateLimiterForRegistration = async (req: Request, res: Response, next: NextFunction) => {
//     const remainingRequests = await limiterForRegistration.removeTokens(1);
//     if (remainingRequests < 0) {
//         res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
//         res.end('429 Too Many Requests - your IP is being rate limited');
//     } else {
//         next()
//     }
// }



// export const rateLimiterForRegistrationConfirmation = async (req: Request, res: Response, next: NextFunction) => {
//     const remainingRequests = await limiterLimiterForRegistrationConfirmation.removeTokens(1);
//     if (remainingRequests < 0) {
//         res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
//         res.end('429 Too Many Requests - your IP is being rate limited');
//     } else {
//         next()
//     }
// }


// export const rateLimiterForEmailResending = async (req: Request, res: Response, next: NextFunction) => {
//     const remainingRequests = await limiterLimiterForEmailResending.removeTokens(1);
//     if (remainingRequests < 0) {
//         res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
//         res.end('429 Too Many Requests - your IP is being rate limited');
//     } else {
//         next()
//     }
// }
//
//
// export const rateLimiterForLogin= async (req: Request, res: Response, next: NextFunction) => {
//     const remainingRequests = await limiterLimiterForLogin.removeTokens(1);
//     if (remainingRequests < 0) {
//         res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'});
//         res.end('429 Too Many Requests - your IP is being rate limited');
//     } else {
//         next()
//     }
// }









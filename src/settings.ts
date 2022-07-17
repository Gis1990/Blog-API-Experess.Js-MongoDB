require('dotenv').config()

export const settings = {
    mongo_URI: process.env.MONGO_URI||'mongodb://localhost:27017/blog',
    jwtSecret: process.env.JWT_SECRET||'secret',
    mailPass: process.env.MAIL_PASS,
}
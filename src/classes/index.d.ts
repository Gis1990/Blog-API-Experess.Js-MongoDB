
import {UserAccountDBClass} from './classes'

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAccountDBClass | null
        }
    }
}
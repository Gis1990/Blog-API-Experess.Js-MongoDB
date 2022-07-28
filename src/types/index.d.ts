
import {UserAccountDBClass} from '../repositories/types'

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAccountDBClass | null
        }
    }
}
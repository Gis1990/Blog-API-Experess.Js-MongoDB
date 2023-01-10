import {NewUserViewModel} from "../../../classes/classes";
import {injectable} from "inversify";
import {AuthService} from "../../auth-service";

@injectable()
export class CreateUserWithoutConfirmationEmailUseCase {
    constructor(private authService: AuthService) {}

    async execute(login: string,email:string, password: string): Promise<NewUserViewModel> {
        const newUser= await this.authService.createUser(login, email, password, true)
        return (({ id, login,email,createdAt }) => ({ id, login,email,createdAt }))(newUser)
    }
}

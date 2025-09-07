import { AuthenticateUserRequestDTO } from "./dto/authenticate-user-request.dto";
import { AuthService } from "@root/service/auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: AuthenticateUserRequestDTO): Promise<any>;
}

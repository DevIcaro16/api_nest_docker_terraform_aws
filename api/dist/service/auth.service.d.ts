import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "@root/repository/users.repository";
interface CredentialsParams {
    email: string;
    password: string;
}
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    constructor(usersRepository: UsersRepository, jwtService: JwtService);
    login(credentials: CredentialsParams): Promise<string>;
}
export {};

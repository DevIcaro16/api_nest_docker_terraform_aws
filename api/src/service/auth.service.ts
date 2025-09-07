import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JWTPayload } from "@root/controller/shared/types";
import { UsersRepository } from "@root/repository/users.repository";
import { compare } from "bcrypt";
import { JWT_SECRET } from "@root/controller/shared/constants";

interface CredentialsParams {
    email: string;
    password: string;
};

@Injectable()
export class AuthService {

    constructor(
        private readonly usersRepository: UsersRepository, 
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {

    }

    public async login(credentials: CredentialsParams): Promise<string> {

        const { email, password } = credentials;

        const user = await this.usersRepository.getUserByEmail(email);
        const passwordMatch = await compare(password, user?.password ?? '');

        if (!user || !passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JWTPayload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), // 30 days
            iat: Math.floor(Date.now() / 1000),
            aud: 'DevIcaro16 assinou esse JWT Token Payload'
        };

        const token: string = await this.jwtService.signAsync(payload, {
            secret: JWT_SECRET,
        });

        return token;
    }

}
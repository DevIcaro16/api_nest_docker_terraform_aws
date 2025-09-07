import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@root/domain/user.domain";
import { UsersRepository } from "@root/repository/users.repository";
import { randomUUID } from "crypto";
import { hash } from 'bcrypt';

interface CreateUserParams{
    name: string;
    email: string;
    password: string;
};

interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository){

    }

    public async createUser(
        params: CreateUserParams,
    ): Promise<string> {

        const userExists: User | undefined = await this.usersRepository.getUserByEmail(params.email);

        if (userExists) {
            throw new BadRequestException('Email already in use.');
        }

        const hashedPassword = await hash(params.password, SALT_ROUNDS);

        const user = new User({
            name: params.name,
            email: params.email,
            password: hashedPassword,
        });

        await this.usersRepository.createUser(user);

        return user.id;

    }

    public async getUserByID(userID: string): Promise<IUser> {

        const user: User | undefined = await this.usersRepository.getUserByID(userID);

        if(!user){
            throw new NotFoundException('User not found.');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
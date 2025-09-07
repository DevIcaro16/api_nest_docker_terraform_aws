import { UsersRepository } from "@root/repository/users.repository";
interface CreateUserParams {
    name: string;
    email: string;
    password: string;
}
interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    createUser(params: CreateUserParams): Promise<string>;
    getUserByID(userID: string): Promise<IUser>;
}
export {};

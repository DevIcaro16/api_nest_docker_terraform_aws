import { ConfigService } from "@nestjs/config";
import { User } from "@root/domain/user.domain";
export declare class UsersRepository {
    private readonly configService;
    private readonly client;
    private readonly tableName;
    constructor(configService: ConfigService);
    createUser(user: User): Promise<void>;
    getUserByEmail(email: string): Promise<User | undefined>;
    getUserByID(userID: string): Promise<User | undefined>;
    private mapUserFromUserRecord;
}

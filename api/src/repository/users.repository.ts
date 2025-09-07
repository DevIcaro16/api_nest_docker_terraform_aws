import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@root/domain/user.domain";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

interface UserRecord{
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable()
export class UsersRepository {

    private readonly client: DynamoDBClient;
    private readonly tableName: string;

    constructor(private readonly configService: ConfigService) {

        const region = this.configService.get<string>('AWS_REGION') ?? 'us-east-1';
        const isLocalDevelopment = this.configService.get<string>('LOCAL_DEVELOPMENT') === 'true';
        const environment = this.configService.get<string>('ENVIRONMENT') ?? 'dev';
        
        this.tableName = `${environment}-users`;
        console.log(this.tableName);
        
        this.client = new DynamoDBClient({
            region,
            endpoint: isLocalDevelopment ? 'http://localhost:8000' : undefined,
        });
    }

    public async createUser(user: User): Promise<void> {

        const command = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }),
            ConditionExpression: 'attribute_not_exists(id)',
        });

        await this.client.send(command);
    }

    public async getUserByEmail(email: string): Promise<User | undefined> {

        const command = new QueryCommand({
                TableName: this.tableName,
                IndexName: 'email_index',
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: marshall({ ':email': email }),
            });

        const response = await this.client.send(command);

        if (response.Items?.length === 0 || !response.Items) {
            return undefined;
        }
        const userRecord = unmarshall(response.Items[0]) as UserRecord;

        return this.mapUserFromUserRecord(userRecord);
    }

    public async getUserByID(userID: string): Promise<User | undefined> {

        const command = new GetItemCommand({
            TableName: this.tableName,
            Key: marshall({ id: userID }),
        });

        const response = await this.client.send(command);

        if (!response.Item) {
            return undefined;
        }
        const userRecord = unmarshall(response.Item) as UserRecord;

        return this.mapUserFromUserRecord(userRecord);
    }

    private mapUserFromUserRecord(userRecord: UserRecord): User {
        return new User({
            id: userRecord.id, 
            name: userRecord.name,
            email: userRecord.email, 
            password: userRecord.password, 
            createdAt: new Date(userRecord.createdAt), 
            updatedAt: new Date(userRecord.updatedAt)
        });
    }
}
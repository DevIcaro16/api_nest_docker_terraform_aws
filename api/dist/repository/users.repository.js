"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_domain_1 = require("../domain/user.domain");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
let UsersRepository = class UsersRepository {
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION') ?? 'us-east-1';
        const isLocalDevelopment = this.configService.get('LOCAL_DEVELOPMENT') === 'true';
        const environment = this.configService.get('ENVIRONMENT') ?? 'dev';
        this.tableName = `${environment}-users`;
        console.log(this.tableName);
        this.client = new client_dynamodb_1.DynamoDBClient({
            region,
            endpoint: isLocalDevelopment ? 'http://localhost:8000' : undefined,
        });
    }
    async createUser(user) {
        const command = new client_dynamodb_1.PutItemCommand({
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)({
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
    async getUserByEmail(email) {
        const command = new client_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            IndexName: 'email_index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({ ':email': email }),
        });
        const response = await this.client.send(command);
        if (response.Items?.length === 0 || !response.Items) {
            return undefined;
        }
        const userRecord = (0, util_dynamodb_1.unmarshall)(response.Items[0]);
        return this.mapUserFromUserRecord(userRecord);
    }
    async getUserByID(userID) {
        const command = new client_dynamodb_1.GetItemCommand({
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ id: userID }),
        });
        const response = await this.client.send(command);
        if (!response.Item) {
            return undefined;
        }
        const userRecord = (0, util_dynamodb_1.unmarshall)(response.Item);
        return this.mapUserFromUserRecord(userRecord);
    }
    mapUserFromUserRecord(userRecord) {
        return new user_domain_1.User({
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            password: userRecord.password,
            createdAt: new Date(userRecord.createdAt),
            updatedAt: new Date(userRecord.updatedAt)
        });
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map
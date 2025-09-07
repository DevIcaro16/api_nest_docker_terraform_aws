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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const create_user_request_dto_1 = require("./dto/create-user-request.dto");
const create_user_response_dto_1 = require("./dto/create-user-response.dto");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("../service/users.service");
const get_user_by_id_response_dto_1 = require("./dto/get-user-by-id-response.dto");
const public_decorator_1 = require("./shared/public-decorator");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(createUserBody) {
        console.log(createUserBody);
        const createdUserID = await this.usersService.createUser({
            name: createUserBody.name,
            email: createUserBody.email,
            password: createUserBody.password,
        });
        return new create_user_response_dto_1.CreateUserResponseDTO(createdUserID);
    }
    async me(request) {
        return this.getUserByID(request.userID);
    }
    async getUserByID(userID) {
        const userResult = await this.usersService.getUserByID(userID);
        return new get_user_by_id_response_dto_1.GetUserByIDResponseDTO({
            id: userResult.id,
            name: userResult.name,
            email: userResult.email,
            createdAt: userResult.createdAt.toISOString(),
            updatedAt: userResult.updatedAt.toISOString(),
        });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)("/"),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'User created successfully',
        type: create_user_response_dto_1.CreateUserResponseDTO,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_request_dto_1.CreateUserRequestDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User found successfully',
        type: get_user_by_id_response_dto_1.GetUserByIDResponseDTO,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Get)(':userID'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'User found successfully',
        type: get_user_by_id_response_dto_1.GetUserByIDResponseDTO,
    }),
    __param(0, (0, common_1.Param)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByID", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiTags)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map
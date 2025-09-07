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
exports.GetUserByIDResponseDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetUserByIDResponseDTO {
    constructor(params) {
        this.id = '';
        this.name = '';
        this.email = '';
        this.createdAt = '';
        this.updatedAt = '';
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}
exports.GetUserByIDResponseDTO = GetUserByIDResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], GetUserByIDResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], GetUserByIDResponseDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", String)
], GetUserByIDResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User creation date',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", String)
], GetUserByIDResponseDTO.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User last update date',
        example: '2024-01-15T10:30:00.000Z',
    }),
    __metadata("design:type", String)
], GetUserByIDResponseDTO.prototype, "updatedAt", void 0);
//# sourceMappingURL=get-user-by-id-response.dto.js.map
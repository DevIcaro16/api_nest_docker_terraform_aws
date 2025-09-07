import { ApiProperty } from "@nestjs/swagger";
import { User } from "@root/domain/user.domain";

export class GetUserByIDResponseDTO {

    @ApiProperty({
        description: 'User unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string = '';

    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
    })
    public name: string = '';

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
    })
    public email: string = '';

    @ApiProperty({
        description: 'User creation date',
        example: '2024-01-15T10:30:00.000Z',
    })
    public createdAt: string = '';

    @ApiProperty({
        description: 'User last update date',
        example: '2024-01-15T10:30:00.000Z',
    })
    public updatedAt: string = '';


    constructor(params: GetUserByIDResponseDTO) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }

}
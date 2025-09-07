import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponseDTO {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string = '';

    constructor(id: string){
        this.id = id;
    }
}
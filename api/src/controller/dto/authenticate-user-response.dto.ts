import { ApiProperty } from "@nestjs/swagger";

export class AuthenticateUserResponseDTO {

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
    })
    public accessToken: string = '';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
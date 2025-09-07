import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthenticateUserRequestDTO {

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
    })
    @IsNotEmpty({ message: 'Email is obrigatório' })
    @IsEmail({}, { message: 'Email inválido' })
    public email: string = '';
    

    @ApiProperty({
        description: 'User password',
        example: 'password',
    })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    public password: string = '';

}
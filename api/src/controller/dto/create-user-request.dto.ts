import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateUserRequestDTO {

    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
    })
    @IsString({ message: 'Nome deve ser uma string' })
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    public name: string = '';

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
    })
    @IsEmail({}, { message: 'Email deve ser um email válido' })
    @IsNotEmpty({ message: 'Email é obrigatório' })
    public email: string = '';
    
    @ApiProperty({
        description: 'User password',
        example: 'password',
    })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    public password: string = '';

    
}
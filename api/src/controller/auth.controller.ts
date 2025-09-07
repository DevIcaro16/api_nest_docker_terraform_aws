import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthenticateUserRequestDTO } from "./dto/authenticate-user-request.dto";
import { AuthService } from "@root/service/auth.service";
import { AuthenticateUserResponseDTO } from "./dto/authenticate-user-response.dto";
import { Public } from "./shared/public-decorator";

@Controller('auth')
@ApiTags('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {

    }

    @Post('login')
    @Public()
    public async login(@Body() credentials: AuthenticateUserRequestDTO): Promise<any>{

        const token = await this.authService.login({
            email: credentials.email,
            password: credentials.password,
        });;

        return new AuthenticateUserResponseDTO(token);
    }

}
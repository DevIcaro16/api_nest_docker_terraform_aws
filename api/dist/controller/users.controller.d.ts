import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { UsersService } from '@root/service/users.service';
import { GetUserByIDResponseDTO } from './dto/get-user-by-id-response.dto';
import { AuthenticatedRequest } from './shared/types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserBody: CreateUserRequestDTO): Promise<CreateUserResponseDTO>;
    me(request: AuthenticatedRequest): Promise<GetUserByIDResponseDTO>;
    getUserByID(userID: string): Promise<GetUserByIDResponseDTO>;
}

import { Body, Controller, HttpCode, HttpStatus, Param, Post, Get, Req } from '@nestjs/common';
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@root/service/users.service';
import { GetUserByIDResponseDTO } from './dto/get-user-by-id-response.dto';
import { AuthenticatedRequest } from './shared/types';
import { Public } from './shared/public-decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {

  }

  @Post("/")
  @Public()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: CreateUserResponseDTO,
  })

  public async createUser(
    @Body() createUserBody: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {

    console.log(createUserBody);

    const createdUserID = await this.usersService.createUser({
      name: createUserBody.name,
      email: createUserBody.email,
      password: createUserBody.password,
    });

    return new CreateUserResponseDTO(createdUserID);
  }

  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
    type: GetUserByIDResponseDTO,
  })
  public async me(@Req() request: AuthenticatedRequest): Promise<GetUserByIDResponseDTO> {
    return this.getUserByID(request.userID);
  }

  @Get(':userID')
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
    type: GetUserByIDResponseDTO,
  })
  public async getUserByID(@Param('userID') userID: string): Promise<GetUserByIDResponseDTO> {

    const userResult = await this.usersService.getUserByID(userID);
    
    return new GetUserByIDResponseDTO({
      id: userResult.id,
      name: userResult.name,
      email: userResult.email,
      createdAt: userResult.createdAt.toISOString(),
      updatedAt: userResult.updatedAt.toISOString(),
    });
  }

}
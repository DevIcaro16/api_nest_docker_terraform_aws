import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { GetUserByIDResponseDTO } from './dto/get-user-by-id-response.dto';
import { AuthenticatedRequest } from './shared/types';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockCreateUserRequest: CreateUserRequestDTO = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  const mockAuthenticatedRequest: AuthenticatedRequest = {
    userID: 'user-123',
  } as AuthenticatedRequest;

  beforeEach(async () => {
    const mockService = {
      createUser: jest.fn(),
      getUserByID: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const expectedUserID = 'user-123';
      service.createUser.mockResolvedValue(expectedUserID);

      // Act
      const result = await controller.createUser(mockCreateUserRequest);

      // Assert
      expect(service.createUser).toHaveBeenCalledWith({
        name: mockCreateUserRequest.name,
        email: mockCreateUserRequest.email,
        password: mockCreateUserRequest.password,
      });
      expect(result).toBeInstanceOf(CreateUserResponseDTO);
      expect(result.id).toBe(expectedUserID);
    });

    it('should throw BadRequestException when email already exists', async () => {
      // Arrange
      service.createUser.mockRejectedValue(
        new BadRequestException('Email already in use.'),
      );

      // Act & Assert
      await expect(controller.createUser(mockCreateUserRequest)).rejects.toThrow(
        new BadRequestException('Email already in use.'),
      );
      expect(service.createUser).toHaveBeenCalledWith({
        name: mockCreateUserRequest.name,
        email: mockCreateUserRequest.email,
        password: mockCreateUserRequest.password,
      });
    });
  });

  describe('getUserByID', () => {
    it('should return user when found', async () => {
      // Arrange
      const userID = 'user-123';
      service.getUserByID.mockResolvedValue(mockUser);

      // Act
      const result = await controller.getUserByID(userID);

      // Assert
      expect(service.getUserByID).toHaveBeenCalledWith(userID);
      expect(result).toBeInstanceOf(GetUserByIDResponseDTO);
      expect(result.id).toBe(mockUser.id);
      expect(result.name).toBe(mockUser.name);
      expect(result.email).toBe(mockUser.email);
      expect(result.createdAt).toBe(mockUser.createdAt.toISOString());
      expect(result.updatedAt).toBe(mockUser.updatedAt.toISOString());
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userID = 'non-existent-user';
      service.getUserByID.mockRejectedValue(
        new NotFoundException('User not found.'),
      );

      // Act & Assert
      await expect(controller.getUserByID(userID)).rejects.toThrow(
        new NotFoundException('User not found.'),
      );
      expect(service.getUserByID).toHaveBeenCalledWith(userID);
    });
  });

  describe('me', () => {
    it('should return current user data', async () => {
      // Arrange
      service.getUserByID.mockResolvedValue(mockUser);

      // Act
      const result = await controller.me(mockAuthenticatedRequest);

      // Assert
      expect(service.getUserByID).toHaveBeenCalledWith(mockAuthenticatedRequest.userID);
      expect(result).toBeInstanceOf(GetUserByIDResponseDTO);
      expect(result.id).toBe(mockUser.id);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      service.getUserByID.mockRejectedValue(
        new NotFoundException('User not found.'),
      );

      // Act & Assert
      await expect(controller.me(mockAuthenticatedRequest)).rejects.toThrow(
        new NotFoundException('User not found.'),
      );
      expect(service.getUserByID).toHaveBeenCalledWith(mockAuthenticatedRequest.userID);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../domain/user.domain';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      getUserByID: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const createUserParams = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      // Arrange
      repository.getUserByEmail.mockResolvedValue(undefined);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      repository.createUser.mockResolvedValue(undefined);

      // Act
      const result = await service.createUser(createUserParams);

      // Assert
      expect(repository.getUserByEmail).toHaveBeenCalledWith(createUserParams.email);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserParams.password, 10);
      expect(repository.createUser).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should throw BadRequestException when email already exists', async () => {
      // Arrange
      repository.getUserByEmail.mockResolvedValue(mockUser as User);

      // Act & Assert
      await expect(service.createUser(createUserParams)).rejects.toThrow(
        new BadRequestException('Email already in use.'),
      );
      expect(repository.getUserByEmail).toHaveBeenCalledWith(createUserParams.email);
      expect(repository.createUser).not.toHaveBeenCalled();
    });

    it('should hash password before creating user', async () => {
      // Arrange
      repository.getUserByEmail.mockResolvedValue(undefined);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      repository.createUser.mockResolvedValue(undefined);

      // Act
      await service.createUser(createUserParams);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserParams.password, 10);
    });
  });

  describe('getUserByID', () => {
    it('should return user when found', async () => {
      // Arrange
      const userID = 'user-123';
      repository.getUserByID.mockResolvedValue(mockUser as User);

      // Act
      const result = await service.getUserByID(userID);

      // Assert
      expect(repository.getUserByID).toHaveBeenCalledWith(userID);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userID = 'non-existent-user';
      repository.getUserByID.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.getUserByID(userID)).rejects.toThrow(
        new NotFoundException('User not found.'),
      );
      expect(repository.getUserByID).toHaveBeenCalledWith(userID);
    });
  });
});

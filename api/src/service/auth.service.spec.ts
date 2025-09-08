import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../domain/user.domain';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<UsersRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockCredentials = {
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const mockRepository = {
      getUserByEmail: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    
    it('should return JWT token when credentials are valid', async () => {
      // Arrange
      const expectedToken = 'jwt-token-123';
      repository.getUserByEmail.mockResolvedValue(mockUser as User);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.login(mockCredentials);

      // Assert
      expect(repository.getUserByEmail).toHaveBeenCalledWith(mockCredentials.email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockCredentials.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        }),
        expect.objectContaining({
          secret: expect.any(String),
        }),
      );
      expect(result).toBe(expectedToken);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      repository.getUserByEmail.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.login(mockCredentials)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(repository.getUserByEmail).toHaveBeenCalledWith(mockCredentials.email);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      repository.getUserByEmail.mockResolvedValue(mockUser as User);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(mockCredentials)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(repository.getUserByEmail).toHaveBeenCalledWith(mockCredentials.email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        mockCredentials.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should create JWT payload with correct structure', async () => {
      // Arrange
      repository.getUserByEmail.mockResolvedValue(mockUser as User);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.signAsync.mockResolvedValue('token');

      // Act
      await service.login(mockCredentials);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          exp: expect.any(Number),
          iat: expect.any(Number),
          aud: 'DevIcaro16 assinou esse JWT Token Payload',
        }),
        expect.any(Object),
      );
    });
  });
});

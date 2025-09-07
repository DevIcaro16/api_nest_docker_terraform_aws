import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { AuthenticateUserRequestDTO } from './dto/authenticate-user-request.dto';
import { AuthenticateUserResponseDTO } from './dto/authenticate-user-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockCredentials: AuthenticateUserRequestDTO = {
    email: 'john@example.com',
    password: 'password123',
  };

  const mockToken = 'jwt-token-123';

  beforeEach(async () => {
    const mockService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return JWT token when credentials are valid', async () => {
      // Arrange
      service.login.mockResolvedValue(mockToken);

      // Act
      const result = await controller.login(mockCredentials);

      // Assert
      expect(service.login).toHaveBeenCalledWith({
        email: mockCredentials.email,
        password: mockCredentials.password,
      });
      expect(result).toBeInstanceOf(AuthenticateUserResponseDTO);
      expect(result.accessToken).toBe(mockToken);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Arrange
      service.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(mockCredentials)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(service.login).toHaveBeenCalledWith({
        email: mockCredentials.email,
        password: mockCredentials.password,
      });
    });

    it('should handle empty credentials', async () => {
      // Arrange
      const emptyCredentials: AuthenticateUserRequestDTO = {
        email: '',
        password: '',
      };
      service.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(emptyCredentials)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(service.login).toHaveBeenCalledWith({
        email: emptyCredentials.email,
        password: emptyCredentials.password,
      });
    });
  });
});

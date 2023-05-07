import { compare, hashSync } from 'bcryptjs';
import { type IAuthService } from './auth.service.interface';
import { JwtService } from './jwt.service';
import { AuthError } from '../errors/AuthError';
import { type AuthorizationResponse } from '../responses';

import {
    type RegisterUserDto,
    type LoginUserDto,
    type ResponseUserDto,
    UserMapper,
} from '../users/dto';

import { type User, UserFactory, type IUserService } from '../users';

export class AuthService implements IAuthService {
    private readonly userService: IUserService;
    constructor() {
        this.userService = new UserFactory().buildService();
    }

    register = async (register: RegisterUserDto): Promise<ResponseUserDto> => {
        const user = UserMapper.mapRegisterUserDto(register);
        user.password = hashSync(user.password);
        const savedUser = await this.userService.save(user);
        return UserMapper.mapUserToResponseDto(savedUser);
    };

    login = async ({ username, password }: LoginUserDto): Promise<AuthorizationResponse> => {
        const foundedUser = await this.userService.findByUsername(username);
        if (foundedUser == null) {
            throw new AuthError(`User with ${username} username doesn't exists.`);
        }
        if (!(await compare(password, foundedUser.password))) {
            throw new AuthError('Incorrect password.');
        }
        const { refreshToken, accessToken } = JwtService.generateTokensForUser(foundedUser);
        const userWithNewToken = structuredClone<User>(foundedUser);
        userWithNewToken.refreshToken = refreshToken;
        await this.userService.update(foundedUser, userWithNewToken);
        return {
            accessToken,
            refreshToken,
            expiresIn: JwtService.getAccessTokenExp(accessToken),
        };
    };

    refresh = async (token: string): Promise<AuthorizationResponse> => {
        if (!JwtService.isRefreshTokenValid(token)) {
            throw new AuthError('Given refresh token is not valid.');
        }
        const payload = JwtService.extractRefreshPayload(token);
        if (!JwtService.isRefresh(payload)) {
            throw new AuthError('Given token is not refresh token.');
        }
        const { userId } = payload;

        const foundedUser = await this.userService.findById(userId);
        if (foundedUser == null) {
            throw new AuthError('There is no user with given token.');
        }
        if (foundedUser.refreshToken != token) {
            throw new AuthError('Given token is not relevant.');
        }
        const { refreshToken, accessToken } = JwtService.generateTokensForUser(foundedUser);
        const userWithNewToken: User = structuredClone(foundedUser);
        foundedUser.refreshToken = refreshToken;
        await this.userService.update(foundedUser, userWithNewToken);
        return {
            refreshToken,
            accessToken,
            expiresIn: JwtService.getAccessTokenExp(accessToken),
        };
    };
}

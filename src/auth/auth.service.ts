import { compare, compareSync, hashSync } from "bcryptjs";
import { IAuthService } from "./auth.service.interface";
import { JwtService, TokensPair } from "./jwt.service";
import { User } from "./users/users.entity";
import { UserFactory } from "./users/users.factory";
import { IUserService } from "./users/users.service.interface";
import { AuthError } from "../errors/AuthError";
import { AuthorizationResponse } from "../responses";
import { RegisterUserDto } from "./users/dto/register.dto";
import { UserMapper } from "./users/dto/users.mapper";
import { LoginUserDto } from "./users/dto/login.dto";
import { ResponseUserDto } from "./users/dto/response.user.dto";


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
    }

    login = async ({ username, password }: LoginUserDto): Promise<AuthorizationResponse> => {
        const foundedUser = await this.userService.findByUsername(username);
        if (!foundedUser) {
            throw new AuthError(404, `User with ${username} username doesn't exists.`);
        }
        if (!await compare(password, foundedUser.password)) {
            throw new AuthError(400, 'Incorrect password.');
        }
        const { refreshToken, accessToken } = JwtService.generateTokensForUser(foundedUser);
        const userWithNewToken: User = structuredClone(foundedUser);
        foundedUser.refreshToken = refreshToken;
        await this.userService.update(foundedUser, userWithNewToken);
        return {
            accessToken,
            refreshToken,
            expiresIn: JwtService.getExp(accessToken)
        };
    }

    refresh = async (token: string): Promise<AuthorizationResponse> => {
        if (!JwtService.isTokenValid(token)) {
            throw new AuthError(400, 'Given refresh token is not valid.');
        }
        const payload = JwtService.extractPayload(token);
        if (!JwtService.isRefresh(payload)) {
            throw new AuthError(400, 'Given token is not refresh token.');
        }
        const { userId } = payload;
        const foundedUser = await this.userService.findById(userId);
        if (!foundedUser || foundedUser.refreshToken != token) {
            throw new AuthError(401, 'Given token is not relevant.');
        }
        const { refreshToken, accessToken } = JwtService.generateTokensForUser(foundedUser);
        const userWithNewToken: User = structuredClone(foundedUser);
        foundedUser.refreshToken = refreshToken;
        await this.userService.update(foundedUser, userWithNewToken);
        return {
            refreshToken,
            accessToken,
            expiresIn: JwtService.getExp(accessToken)
        }

    }

}
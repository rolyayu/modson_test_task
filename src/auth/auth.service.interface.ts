import { AuthorizationResponse } from "../responses";
import { TokensPair } from "./jwt.service";
import { LoginUserDto } from "./users/dto/login.dto";
import { RegisterUserDto } from "./users/dto/register.dto";
import { ResponseUserDto } from "./users/dto/response.user.dto";
import { User } from "./users/users.entity";

export interface IAuthService {
    register(register: RegisterUserDto): Promise<ResponseUserDto>;

    login(login: LoginUserDto): Promise<AuthorizationResponse>;

    refresh(refreshToken: string): Promise<AuthorizationResponse>;
}
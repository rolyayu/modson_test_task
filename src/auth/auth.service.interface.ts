import { AuthorizationResponse } from "../responses";
import { LoginUserDto, RegisterUserDto, ResponseUserDto } from "../users/dto";

export interface IAuthService {
    register(register: RegisterUserDto): Promise<ResponseUserDto>;

    login(login: LoginUserDto): Promise<AuthorizationResponse>;

    refresh(refreshToken: string): Promise<AuthorizationResponse>;
}
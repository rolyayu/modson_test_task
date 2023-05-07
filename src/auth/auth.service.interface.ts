import { type AuthorizationResponse } from '../responses';
import { type LoginUserDto, type RegisterUserDto, type ResponseUserDto } from '../users/dto';

export interface IAuthService {
    register: (register: RegisterUserDto) => Promise<ResponseUserDto>;

    login: (login: LoginUserDto) => Promise<AuthorizationResponse>;

    refresh: (refreshToken: string) => Promise<AuthorizationResponse>;
}

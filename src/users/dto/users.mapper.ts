import { User } from '../users.entity';
import { type RegisterUserDto } from './register.dto';
import { type ResponseUserDto } from './response.user.dto';

export class UserMapper {
    static mapRegisterUserDto = ({ username, password }: RegisterUserDto): User => {
        const mappedUser = new User();
        mappedUser.username = username;
        mappedUser.password = password;
        return mappedUser;
    };

    static mapUserToResponseDto = ({ username, id, role }: User): ResponseUserDto => {
        return {
            username,
            id,
            role: role.toString(),
        } satisfies ResponseUserDto;
    };
}

import { User } from '../users.entity';
import { type ResponseUserDto } from './response.user.dto';

export class UserMapper {
    static mapUserToResponseDto = ({ username, id, role }: User): ResponseUserDto => {
        return {
            username,
            id,
            role: role.toString(),
        } satisfies ResponseUserDto;
    };
}

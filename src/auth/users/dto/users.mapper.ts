import { User } from "../users.entity";
import { RegisterUserDto } from "./register.dto";
import { ResponseUserDto } from "./response.user.dto";

export class UserMapper {
    static mapRegisterUserDto = ({ username, password }: RegisterUserDto): User => {
        const mappedUser = new User();
        mappedUser.username = username;
        mappedUser.password = password;
        // mappedUser.roles = roles?.map(roleName => {
        //     const role = new UserRole();
        //     role.name = roleName;
        //     return role;
        // }) || [];
        return mappedUser;
    }

    static mapUserToResponseDto = ({ username, id, role }: User): ResponseUserDto => {
        return {
            username,
            id,
            role: role.toString()
        } satisfies ResponseUserDto;
    }
}
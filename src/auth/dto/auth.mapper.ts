import { RegisterUserDto } from ".";
import { User } from "../../users";


export class AuthMapper {
    static mapRegisterUserDto = ({ username, password }: RegisterUserDto): User => {
        const mappedUser = new User();
        mappedUser.username = username;
        mappedUser.password = password;
        return mappedUser;
    };
}
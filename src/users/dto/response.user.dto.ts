import { IsEnum, IsPositive, Length, Matches } from "class-validator";
import { UserRole } from "../users.entity";

export class ResponseUserDto {
    @IsPositive()
    id: number;

    @Length(5, 40)
    @Matches(new RegExp('[A-Za-z0-9_]*'))
    username: string;
    @IsEnum(UserRole)
    role: string;
}

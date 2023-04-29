import { Length, Matches } from "class-validator";

export class LoginUserDto {
    @Length(5, 40)
    @Matches(new RegExp('[A-Za-z0-9_]*'))
    username: string;

    @Length(5, 40)
    @Matches(new RegExp('[A-Za-z0-9_]*'))
    password: string;
}
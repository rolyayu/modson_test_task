import { IBaseService } from "../../interfaces";
import { User } from "./users.entity";

export interface IUserService extends IBaseService<User> {
    findByUsername(username: string): Promise<User | null>;
    findByRefresh(token: string): Promise<User | null>;
    grantManagerRoleById(userId: number): Promise<User>;
}
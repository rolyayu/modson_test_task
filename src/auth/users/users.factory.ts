import { Repository } from "typeorm";
import { IBaseFactory, IBaseService } from "../../interfaces";
import { User } from "./users.entity";
import { TypeOrmConnection } from "../../database";
import { UserService } from "./users.service";
import { IUserService } from "./users.service.interface";


export class UserFactory implements IBaseFactory<User, IUserService> {
    buildService(): IUserService {
        return new UserService(
            this.createRepository()
        );
    }
    createRepository(): Repository<User> {
        return TypeOrmConnection.getConnection().getRepository(User);
    }
}
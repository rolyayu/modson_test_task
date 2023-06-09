import { type Repository, TypeORMError } from 'typeorm';
import { type User, UserRole } from './users.entity';
import { AuthError } from '../shared';
import { type IUserService } from './users.service.interface';
import { UserNotFoundError } from '../shared';

export class UserService implements IUserService {
    constructor(private readonly userRepository: Repository<User>) { }

    grantManagerRoleById = async (userId: number): Promise<User> => {
        const foundedUser = await this.userRepository.findOneBy({ id: userId });
        if (foundedUser == null) {
            throw new UserNotFoundError(`User with ${userId} id not exists.`);
        }
        const userToGrant: User = structuredClone(foundedUser);
        userToGrant.role = UserRole.MANAGER;
        const updatedUser = await this.update(foundedUser, userToGrant);
        return updatedUser;
    };

    update = async (toUpdate: User, withUpdatedProperties: User): Promise<User> => {
        toUpdate.password = withUpdatedProperties.password || toUpdate.password;
        toUpdate.username = withUpdatedProperties.username || toUpdate.username;
        toUpdate.role = withUpdatedProperties.role || toUpdate.role;
        toUpdate.refreshToken = withUpdatedProperties.refreshToken || toUpdate.refreshToken;
        return await this.userRepository.save(toUpdate);
    };

    findEntityByItsId = async (id: number): Promise<User | null> => {
        return await this.userRepository.findOneBy({ id });
    };

    findAll = async (startPos: number, pageSize: number): Promise<User[]> => {
        return await this.userRepository
            .createQueryBuilder('users')
            .skip(startPos)
            .take(pageSize)
            .select()
            .getMany();
    };

    findByRefresh = async (token: string): Promise<User | null> => {
        return await this.userRepository.findOneBy({ refreshToken: token });
    };

    findByUsername = async (username: string): Promise<User | null> => {
        return await this.userRepository.findOneBy({ username });
    };

    save = async (value: User): Promise<User> => {
        if (
            await this.userRepository.exist({
                where: {
                    username: value.username,
                },
            })
        ) {
            throw new AuthError(`User with ${value.username} username already exists.`);
        }

        return await this.userRepository.save(value);
    };

    deleteEntityByItsId = async (id: number): Promise<void> => {
        const user = await this.findEntityByItsId(id);
        if (user == null) {
            throw new TypeORMError(`Meet up this '${id}' id doesn't exists.`);
        }
        await this.userRepository.remove([user]);
    };
}

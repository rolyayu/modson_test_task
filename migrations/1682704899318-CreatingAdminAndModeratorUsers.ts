import { MigrationInterface, QueryRunner } from "typeorm"
import { User, UserRole } from "../src/auth/users/users.entity"
import { hash, hashSync } from 'bcryptjs'

export class CreatingAdminAndModeratorUsers1682704899318 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const admin = this.createUser('admin', 'admin', UserRole.ADMIN);
        const manager = this.createUser('manager', 'manager', UserRole.MANAGER);
        const userRepo = await queryRunner.manager.getRepository(User);
        await userRepo.save([admin, manager]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userRepo = await queryRunner.manager.getRepository(User);
        await userRepo.delete({ username: 'admin' });
        await userRepo.delete({ username: 'manager' });
    }

    private createUser = (username: string, password: string, role: UserRole): User => {
        const user = new User();
        user.username = username;
        user.password = hashSync(password);
        user.role = role;
        return user;
    }
}

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    USER = 'user',
    MANAGER = 'manager',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: false,
        length: 40,
    })
    username: string;

    @Column({
        nullable: false,
    })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({
        name: 'refresh_token',
        nullable: true,
    })
    refreshToken: string;
}

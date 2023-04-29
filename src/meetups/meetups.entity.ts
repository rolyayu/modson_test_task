import { Entity, Column, ManyToMany, JoinTable, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import MeetUpTag from "./meetups-tag.entity";
import { User } from "../auth/users/users.entity";

@Entity({ name: 'meetups' })
export default class MeetUp {
    @Column({
        type: "number",
        name: 'meetup_id'
    })
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        nullable: false
    })
    title: string;

    @Column({
        type: "text",
        nullable: false
    })
    description: string;

    @Column({
        type: 'timestamp',
        nullable: false
    })
    eventTime: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, {
        nullable: false,
        eager: true
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    createdBy: User

    @ManyToMany(() => MeetUpTag, {
        eager: true,
        cascade: true
    })
    @JoinTable({
        name: 'meetups_tags',
        joinColumn: { name: 'meetup_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
    })
    tags: MeetUpTag[]
}
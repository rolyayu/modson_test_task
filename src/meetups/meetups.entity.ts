import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, PrimaryGeneratedColumn } from "typeorm";
import MeetUpTag from "./meetups-tag.entity";

@Entity({ name: 'meetups' })
export default class MeetUp {
    @Column({
        type: "number",
    })
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false
    })
    title: string;

    @Column({
        type: "text",
        nullable: false
    })
    description: string;

    @ManyToMany(() => MeetUpTag, {
        cascade: true
    })
    @JoinTable()
    tags: MeetUpTag[]
}
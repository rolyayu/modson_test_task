import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('meetups_tags')
export default class MeetUpTag {
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
    name: string;
}
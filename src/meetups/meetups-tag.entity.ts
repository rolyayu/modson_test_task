import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('tags')
export class MeetUpTag {
    @Column({
        type: "number",
        name: 'tag_id'
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
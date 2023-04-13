import { Repository } from "typeorm";
import { IBaseFactory, IBaseService } from "../interfaces";
import MeetUp from "./meetups.entity";
import { TypeOrmConnection } from "../database";
import MeetUpService from "./meetups.service";
import MeetUpTag from "./meetups-tag.entity";

export class MeetUpFactory implements IBaseFactory<MeetUp> {
    createRepository = (): Repository<MeetUp> => {
        const meetUpRepo: Repository<MeetUp> = TypeOrmConnection.getConnection().getRepository(MeetUp);
        return meetUpRepo;
    }
    buildService = (): IBaseService<MeetUp> => {
        const tagsRepo = TypeOrmConnection.getConnection().getRepository(MeetUpTag)
        return new MeetUpService(this.createRepository(), tagsRepo);
    }

}
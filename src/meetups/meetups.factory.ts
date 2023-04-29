import { Repository } from "typeorm";
import { IBaseFactory } from "../interfaces";
import { TypeOrmConnection } from "../database";
import MeetUpService from "./meetups.service";
import { IMeetUpService, MeetUp, MeetUpTag } from "./";

export class MeetUpFactory implements IBaseFactory<MeetUp, IMeetUpService> {
    createRepository = (): Repository<MeetUp> => {
        const meetUpRepo: Repository<MeetUp> = TypeOrmConnection.getConnection().getRepository(MeetUp);
        return meetUpRepo;
    }
    buildService = (): IMeetUpService => {
        const tagsRepo = TypeOrmConnection.getConnection().getRepository(MeetUpTag)
        return new MeetUpService(this.createRepository(), tagsRepo);
    }

}
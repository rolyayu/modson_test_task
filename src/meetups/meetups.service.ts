import MeetUp from './meetups.entity';
import { Repository, TypeORMError } from 'typeorm';
import { IBaseService, QueryCriteria } from '../interfaces/base-service.interface';
import MeetUpTag from './meetups-tag.entity';

class MeetUpService implements IBaseService<MeetUp>{
    constructor(private meetUpRepository: Repository<MeetUp>, private tagRepository: Repository<MeetUpTag>) { }

    findOneByCriteria = async (criteria: QueryCriteria<MeetUp>): Promise<MeetUp | null> => {
        return await this.meetUpRepository.findOneBy(criteria);
    }

    findAllByCriteria = async (criteria: QueryCriteria<MeetUp>): Promise<MeetUp[]> => {
        return await this.meetUpRepository.findBy(criteria);
    }

    save = async (value: MeetUp): Promise<MeetUp> => {
        if (await this.meetUpRepository.exist({
            where: {
                title: value.title
            }
        })) {
            return await this.meetUpRepository.findOneBy({ title: value.title }) as MeetUp;
        }
        value.tags = await Promise.all(value.tags.map(async tag => {
            if (await this.tagRepository.exist({
                where: {
                    name: tag.name
                }
            })) {
                return await this.tagRepository.findOneBy({ name: tag.name }) as MeetUpTag
            } else {
                const saved = await this.tagRepository.save(tag);
                return saved;
            }
        }))

        return await this.meetUpRepository.save(value);
    }

    deleteById = async (id: number): Promise<void | never> => {
        if (!await this.meetUpRepository.exist({
            where: {
                id
            }
        })) {
            throw new TypeORMError(`Meet up this '${id}' id doesn't exists.`)
        }
        const meetUp = await this.findById(id);
        meetUp!.tags = [];
        const meetUpWithoutTags = await this.meetUpRepository.save(meetUp!);
        await this.meetUpRepository.remove([meetUpWithoutTags]);
    }

    deleteByCriteria = async (criteria: QueryCriteria<MeetUp>): Promise<number> => {
        const meetupsToDelete = await this.meetUpRepository.findBy(criteria);
        const meetupsWithoutTags = meetupsToDelete.map(meetup => {
            meetup.tags = [];
            return meetup;
        })
        const savedMeetups = await this.meetUpRepository.save(meetupsWithoutTags);
        const rowsToDelete = savedMeetups.length;
        await this.meetUpRepository.remove(savedMeetups);
        return rowsToDelete;
    }

    findById = async (id: number): Promise<MeetUp | null> => {
        return await this.meetUpRepository.findOneBy({ id });
    }
    findAll = async (): Promise<MeetUp[]> => {
        return await this.meetUpRepository.find();
    }
}

export default MeetUpService;
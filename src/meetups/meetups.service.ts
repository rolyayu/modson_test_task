import MeetUp from './meetups.entity';
import { Repository, TypeORMError } from 'typeorm';
import { IBaseService } from '../interfaces/base-service.interface';
import MeetUpTag from './meetups-tag.entity';

class MeetUpService implements IBaseService<MeetUp>{
    constructor(private meetUpRepository: Repository<MeetUp>, private tagRepository: Repository<MeetUpTag>) { }

    save = async (meetup: MeetUp): Promise<MeetUp> => {
        if (await this.meetUpRepository.exist({
            where: {
                title: meetup.title
            }
        })) {
            throw new TypeORMError(`Meet up with ${meetup.title} title alreadyExists.`)
        }
        meetup.tags = await Promise.all(meetup.tags.map(async tag => {
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

        return await this.meetUpRepository.save(meetup);
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

    findById = async (id: number): Promise<MeetUp | null> => {
        return await this.meetUpRepository.findOneBy({ id });
    }
    findAll = async (): Promise<MeetUp[]> => {
        return await this.meetUpRepository.find();
    }
}

export default MeetUpService;
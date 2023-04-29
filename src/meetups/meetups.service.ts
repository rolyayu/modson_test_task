import { Repository, TypeORMError } from 'typeorm';
import { User } from '../users/users.entity';
import { MeetUpNotFoundError } from '../errors';
import { NotAllowedError } from '../errors';
import { MeetUp, MeetUpTag, IMeetUpService } from './'

class MeetUpService implements IMeetUpService {
    constructor(private meetUpRepository: Repository<MeetUp>, private tagRepository: Repository<MeetUpTag>) { }

    updateById = async (id: number, createdBy: User, withUpdatedProperties: MeetUp): Promise<MeetUp> => {
        const foundedMeetUp = await this.findById(id);
        if (!foundedMeetUp) {
            throw new MeetUpNotFoundError(`Meet up with ${id} id doesn't exists.`);
        }
        if (foundedMeetUp.createdBy.username != createdBy.username) {
            throw new NotAllowedError(`User ${createdBy.username} cannot delete this meet up`);
        }
        const updatedMeetUp = await this.update(foundedMeetUp, withUpdatedProperties);
        return updatedMeetUp;
    }

    deleteByIdAccodingToUser = async (meetUpId: number, user: User): Promise<void> => {
        const foundedMeetUp = await this.findById(meetUpId);
        if (!foundedMeetUp) {
            throw new MeetUpNotFoundError(`Meet up with ${meetUpId} id not exists.`)
        }
        if ((foundedMeetUp.createdBy.username != user.username)) {
            throw new NotAllowedError(`User ${user.username} can't delete meet up with ${meetUpId} id.`)
        }
        await this.deleteById(meetUpId);
    }

    createMeetUp(meetUp: MeetUp, user: User): Promise<MeetUp> {
        meetUp.createdBy = user;
        return this.save(meetUp);
    }

    update = async (toUpdate: MeetUp, withUpdatedProperties: MeetUp): Promise<MeetUp> => {
        toUpdate.description = withUpdatedProperties.description || toUpdate.description;
        toUpdate.eventTime = withUpdatedProperties.eventTime || toUpdate.eventTime;
        toUpdate.title = withUpdatedProperties.title || withUpdatedProperties.title;
        toUpdate.tags = withUpdatedProperties.tags || toUpdate.tags;

        return await this.save(toUpdate);
    }

    save = async (meetup: MeetUp): Promise<MeetUp> => {
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

    findAll = async (startPos: number, pageSize: number): Promise<MeetUp[]> => {
        const foundedMeetUps = await this.meetUpRepository.createQueryBuilder('meetups')
            .skip(startPos)
            .take(pageSize)
            .innerJoinAndSelect('meetups.createdBy', 'user')
            .innerJoinAndSelect('meetups.tags', 'tags')
            .getMany();
        return foundedMeetUps.filter(meetUp => meetUp);
    }
}

export default MeetUpService;
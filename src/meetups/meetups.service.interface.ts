import { type User } from '../users';
import { type IBaseService } from '../interfaces';
import { type MeetUp } from './';

export interface IMeetUpService extends IBaseService<MeetUp> {
    createMeetUp: (meetUp: MeetUp, user: User) => Promise<MeetUp>;
    deleteByIdAccodingToUser: (meetUpId: number, user: User) => Promise<void>;
    updateById: (id: number, createdBy: User, withUpdatedProperties: MeetUp) => Promise<MeetUp>;
}

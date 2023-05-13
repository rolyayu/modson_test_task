import { type User } from '../users';
import { type IBaseService } from '../shared';
import { type MeetUp } from './';

export interface IMeetUpService extends IBaseService<MeetUp> {
    createMeetUp: (meetUp: MeetUp, user: User) => Promise<MeetUp>;
    deleteByMeetupIdAccodingToUser: (meetUpId: number, user: User) => Promise<void>;
    updateByMeetupId: (id: number, createdBy: User, withUpdatedProperties: MeetUp) => Promise<MeetUp>;
    getCount: () => Promise<number>;
}

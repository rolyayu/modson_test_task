import { User } from "../auth/users/users.entity";
import { IBaseService } from "../interfaces";
import MeetUp from "./meetups.entity";

export interface IMeetUpService extends IBaseService<MeetUp> {
    createMeetUp(meetUp: MeetUp, user: User): Promise<MeetUp>;
    deleteByIdAccodingToUser(meetUpId: number, user: User): Promise<void>;
    updateById(id: number, createdBy: User, withUpdatedProperties: MeetUp): Promise<MeetUp>
}
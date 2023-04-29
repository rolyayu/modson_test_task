import { User } from "../users";
import { IBaseService } from "../interfaces";
import { MeetUp } from "./";

export interface IMeetUpService extends IBaseService<MeetUp> {
    createMeetUp(meetUp: MeetUp, user: User): Promise<MeetUp>;
    deleteByIdAccodingToUser(meetUpId: number, user: User): Promise<void>;
    updateById(id: number, createdBy: User, withUpdatedProperties: MeetUp): Promise<MeetUp>
}
import MeetUpTag from "../meetups-tag.entity";
import MeetUp from "../meetups.entity";
import { CreateMeetUpDto } from "./create.dto";
import { ResponseMeetUpDto } from "./response.dto";
import { UpdateMeetUpDto } from "./update.dto";

export class MeetUpDtoMapper {
    static mapCreateMeetUpDto = ({ title, description, eventTime, tags }: CreateMeetUpDto): MeetUp => {
        const meetUp = new MeetUp();
        meetUp.title = title;
        meetUp.description = description;
        meetUp.eventTime = eventTime;
        meetUp.tags = tags.map(tagName => {
            const tag = new MeetUpTag();
            tag.name = tagName;
            return tag;
        });
        return meetUp;
    }

    static mapUpdateMeetUpDto = ({ title, description, eventTime, tags }: UpdateMeetUpDto): MeetUp => {
        const meetUp = new MeetUp();
        meetUp.title = title;
        meetUp.description = description;
        meetUp.eventTime = eventTime;
        meetUp.tags = tags.map(tagName => {
            const tag = new MeetUpTag();
            tag.name = tagName;
            return tag;
        }) || [];
        return meetUp;
    }

    static mapToResponseMeetUpDto = ({ createdAt, createdBy, description, eventTime, title, tags }: MeetUp): ResponseMeetUpDto => {
        const resp = new ResponseMeetUpDto();
        resp.title = title;
        resp.createdAt = createdAt;
        resp.createdBy = createdBy.username;
        resp.description = description;
        resp.tags = tags.map(tag => tag.name);
        resp.eventTime = eventTime;
        return resp;
    }
}
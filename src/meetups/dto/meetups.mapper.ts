import MeetUpTag from "../meetups-tag.entity";
import MeetUp from "../meetups.entity";
import CreateMeetUpDto from "./create.dto";

export class MeetUpDtoMapper {
    static mapCreateMeetUpDto = (dto: CreateMeetUpDto): MeetUp => {
        const meetUp = new MeetUp();
        meetUp.title = dto.title;
        meetUp.description = dto.description;
        meetUp.eventTime = dto.eventTime;
        meetUp.tags = dto.tags?.map(tagName => {
            const tag = new MeetUpTag();
            tag.name = tagName;
            return tag;
        }) || [];
        return meetUp;
    }
}
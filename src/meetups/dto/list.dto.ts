import { ResponseMeetUpDto } from "./";

export interface ListMeetUpDto {
    totalCount: number;
    startPos: number;
    pageSize: number;
    meetups: ResponseMeetUpDto[]
}
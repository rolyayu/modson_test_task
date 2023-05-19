import { IsArray, IsNumber, IsObject, IsPositive, Min, ValidateNested } from "class-validator";
import { ResponseMeetUpDto } from "./";

export class ListMeetUpDto {
    @IsNumber()
    @Min(0)
    totalCount: number;
    @IsNumber()
    @Min(0)
    startPos: number;
    @IsNumber()
    @Min(15)
    pageSize: number;

    @ValidateNested({ each: true })
    meetups: ResponseMeetUpDto[]
}
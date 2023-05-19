import { IsDate, Length, Matches, MinDate, MinLength } from "class-validator";

export class ResponseMeetUpDto {
    @MinLength(5, {
        message: 'Title should contain at least 10 symbols.',
    })
    title: string;
    @MinLength(20, {
        message: 'Description should contain at least 20 symbols.',
    })
    description: string;
    @Length(3, 30, { each: true, message: 'Each tag should contains 3-30 sybmols.' })
    tags: string[];

    @Length(5, 40)
    @Matches(new RegExp('[A-Za-z0-9_]*'))
    createdBy: string;
    @IsDate()
    @MinDate(new Date())
    createdAt: Date;
    @IsDate()
    @MinDate(new Date())
    eventTime: Date;
}

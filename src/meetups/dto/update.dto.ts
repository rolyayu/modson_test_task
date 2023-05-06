import { IsDate, IsOptional, Length, MinDate, MinLength } from 'class-validator';

export class UpdateMeetUpDto {
  @MinLength(10, {
    message: 'Title should contain at least 10 symbols.',
  })
  @IsOptional()
  title: string;

  @MinLength(20, {
    message: 'Description should contain at least 20 symbols.',
  })
  @IsOptional()
  description: string;

  @Length(3, 30, { each: true, message: 'Each tag should contains 3-30 sybmols.' })
  @IsOptional()
  tags: string[];

  @IsDate()
  @MinDate(new Date())
  @IsOptional()
  eventTime: Date;
}

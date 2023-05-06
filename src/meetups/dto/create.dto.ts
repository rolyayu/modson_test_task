import {
  IsArray,
  IsDate,
  IsOptional,
  Length,
  MaxLength,
  MinDate,
  MinLength,
  isDate,
  isNotEmpty,
  isString,
} from 'class-validator';

export class CreateMeetUpDto {
  @MinLength(5, {
    message: 'Title should contain at least 10 symbols.',
  })
  readonly title: string;

  @MinLength(20, {
    message: 'Description should contain at least 20 symbols.',
  })
  readonly description: string;

  @Length(3, 30, { each: true, message: 'Each tag should contains 3-30 sybmols.' })
  @IsOptional()
  readonly tags: string[] = [];

  @IsDate()
  @MinDate(new Date())
  @IsOptional()
  readonly eventTime: Date = new Date(Date.now() + 1000 * 3600 * 24);
}

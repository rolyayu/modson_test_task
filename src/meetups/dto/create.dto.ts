
export class CreateMeetUpDto {
    readonly title: string;
    readonly description: string;
    readonly tags?: string[];
    readonly eventTime: Date = new Date();
}

export default CreateMeetUpDto;
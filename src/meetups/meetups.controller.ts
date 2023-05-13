import {
    JsonController,
    Get,
    HttpCode,
    Body,
    Param,
    Res,
    Delete,
    Patch,
    QueryParam,
    Authorized,
    CurrentUser,
    UseBefore,
    Post,
} from 'routing-controllers';
import { Response } from 'express';
import {
    type SuccessResponse,
    type FailureResponse,
    ok,
    created,
} from '../shared';

import { type IMeetUpService, MeetUpFactory } from './';

import { User, UserRole } from '../users';

import { CreateMeetUpDto, MeetUpDtoMapper, UpdateMeetUpDto } from './dto';
import { MeetUpNotFoundError } from '../shared';
import { VerifyTokenMiddleware } from '../middlewares';
import { type Logger } from 'winston';
import { LoggerFactory } from '../utils';
import { ListMeetUpDto } from './dto/list.dto';

@JsonController('/api/meetups')
@UseBefore(VerifyTokenMiddleware)
export default class MeetupController {

    private readonly meetUpService: IMeetUpService;
    private readonly logger: Logger;
    constructor() {
        this.meetUpService = new MeetUpFactory().buildService();
        this.logger = LoggerFactory.getLogger('MeetupController');
    }

    @Get()
    @Authorized()
    async getAll(
        @QueryParam('startPos', { required: false }) startPos = 0,
        @QueryParam('pageSize', { required: false }) pageSize = 30,
        @CurrentUser({ required: true }) { username }: User
    ): Promise<ListMeetUpDto> {
        const meetUps = await this.meetUpService.findAll(startPos, pageSize);
        const mappedMeetUps = meetUps.map((meet) => MeetUpDtoMapper.mapToResponseMeetUpDto(meet));
        const totalCount = await this.meetUpService.getCount();
        this.logger.info(
            `User ${username} requested meetups from ${startPos} to ${startPos + pageSize}. Total count: ${totalCount}.`
        );
        const list: ListMeetUpDto = {
            totalCount,
            startPos, pageSize,
            meetups: mappedMeetUps
        };
        return list;
    }

    @Get('/:id')
    @Authorized()
    async getMeetUpByMeetupId(
        @Param('id') id: number,
        @CurrentUser({ required: true }) { username }: User
    ): Promise<SuccessResponse | FailureResponse> {
        const foundedMeetup = await this.meetUpService.findById(id);
        if (foundedMeetup == null) {
            throw new MeetUpNotFoundError(`Meet up with ${id} id doesn't exists.`);
        }
        this.logger.info(`User ${username} requested meetup with ${id} id.`);
        return ok(MeetUpDtoMapper.mapToResponseMeetUpDto(foundedMeetup));
    }

    @Post()
    @HttpCode(201)
    @Authorized([UserRole.MANAGER])
    async createMeetUp(
        @Body({ validate: true }) createDto: CreateMeetUpDto,
        @Res() res: Response,
        @CurrentUser({ required: true }) user: User
    ): Promise<SuccessResponse | FailureResponse> {
        const mappedMeetUp = MeetUpDtoMapper.mapCreateMeetUpDto(createDto);
        const savedMeetUp = await this.meetUpService.createMeetUp(mappedMeetUp, user);
        const mappedRespose = MeetUpDtoMapper.mapToResponseMeetUpDto(savedMeetUp);
        this.logger.info(`Created meetup: ${mappedRespose}`);
        return created(mappedRespose);
    }

    @Delete('/:id')
    @Authorized([UserRole.MANAGER])
    async deleteMeetUpByMeetupId(
        @Param('id') id: number,
        @Res() response: Response,
        @CurrentUser({ required: true }) user: User
    ): Promise<Response | FailureResponse> {
        await this.meetUpService.deleteByMeetupIdAccodingToUser(id, user);
        this.logger.info(`Meetup with ${id} id successfully deleted by ${user.username}.`);
        return response.sendStatus(204);
    }

    @Patch('/:id')
    @Authorized([UserRole.MANAGER])
    async updateMeetUp(
        @Body({ validate: true }) updateDto: UpdateMeetUpDto,
        @Res() resp: Response,
        @Param('id') id: number,
        @CurrentUser({ required: true }) user: User
    ): Promise<SuccessResponse | FailureResponse> {
        const withUpdatedProperties = MeetUpDtoMapper.mapUpdateMeetUpDto(updateDto);
        const updatedMeetUp = await this.meetUpService.updateByMeetupId(
            id,
            user,
            withUpdatedProperties
        );
        const mappedResponse = MeetUpDtoMapper.mapToResponseMeetUpDto(updatedMeetUp);
        this.logger.info(
            `User ${user.username} updated meetup with ${id} id: ${mappedResponse}`
        );
        return ok(mappedResponse);
    }
}

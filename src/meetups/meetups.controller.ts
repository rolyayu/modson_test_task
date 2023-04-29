import { JsonController, Get, HttpCode, Body, Param, Res, Delete, Put, Patch, QueryParams, QueryParam, Authorized, CurrentUser, HttpError, } from "routing-controllers";
import { CreateMeetUpDto } from "./dto/create.dto";
import { MeetUpFactory } from "./meetups.factory";
import { MeetUpDtoMapper } from "./dto/meetups.mapper";
import { Response } from 'express';
import { SuccessResponse, FailureResponse, forbidden, notFound, ok, badRequest, created, internalError, } from "../responses";
import { IMeetUpService } from "./meetups.service.interface";
import MeetUp from "./meetups.entity";
import { IsPositive } from "class-validator";
import { UpdateMeetUpDto } from "./dto/update.dto";
import { User, UserRole } from "../auth/users/users.entity";

@JsonController('/api/meetups')
export default class MeetupController {
    private meetUpService: IMeetUpService;
    constructor() {
        this.meetUpService = new MeetUpFactory().buildService();
    }

    @Get()
    async getAll(
        @QueryParam('startPos', { required: false }) startPos: number = 0,
        @QueryParam('pageSize', { required: false }) pageSize: number = 30
    ): Promise<SuccessResponse> {
        const meetUps = await this.meetUpService.findAll(startPos, pageSize);
        console.log(meetUps);
        const mappedMeetUps = meetUps.map(meet => MeetUpDtoMapper.mapToResponseMeetUpDto(meet));
        return ok(mappedMeetUps);
    }

    @Get("/:id")
    async getMeetUpById(@Param("id") id: number, @Res() response: Response): Promise<SuccessResponse | FailureResponse> {
        const foundedMeetup = await this.meetUpService.findById(id);
        if (!foundedMeetup) {
            response.statusCode = 404;
            return notFound(`Meet up with ${id} id doesn't exists.`);
        }
        return ok(MeetUpDtoMapper.mapToResponseMeetUpDto(foundedMeetup));

    }

    @Put()
    @HttpCode(201)
    @Authorized([UserRole.MANAGER])
    async createMeetUp(
        @Body({ validate: true }) createDto: CreateMeetUpDto,
        @Res() res: Response,
        @CurrentUser({ required: true }) user: User
    ): Promise<SuccessResponse | FailureResponse> {
        const mappedMeetUp = MeetUpDtoMapper.mapCreateMeetUpDto(createDto);
        const savedMeetUp = await this.meetUpService.createMeetUp(mappedMeetUp, user);
        return created(MeetUpDtoMapper.mapToResponseMeetUpDto(savedMeetUp));
    }

    @Delete("/:id")
    @Authorized([UserRole.MANAGER])
    async deleteMeetUpById(
        @Param("id") id: number,
        @Res() response: Response,
        @CurrentUser({ required: true }) user: User
    ): Promise<SuccessResponse | FailureResponse> {
        try {
            await this.meetUpService.deleteByIdAccodingToUser(id, user);
            return ok(`Meet up with ${id} successfully deleted`);
        } catch (e) {
            if (e instanceof HttpError) {
                response.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message,
                    name: e.name
                }
            }
            return internalError();
        }
    }

    @Patch("/:id")
    @Authorized([UserRole.MANAGER])
    async updateMeetUp(
        @Body({ validate: true }) updateDto: UpdateMeetUpDto,
        @Res() resp: Response,
        @Param('id') id: number,
        @CurrentUser({ required: true }) user: User
    ): Promise<SuccessResponse | FailureResponse> {
        try {
            const withUpdatedProperties = MeetUpDtoMapper.mapUpdateMeetUpDto(updateDto);
            const updatedMeetUp = await this.meetUpService.updateById(id, user, withUpdatedProperties);
            return ok(MeetUpDtoMapper.mapToResponseMeetUpDto(updatedMeetUp));
        } catch (e) {
            if (e instanceof HttpError) {
                resp.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message,
                    name: e.name
                }
            }
            return internalError();
        }
    }
}
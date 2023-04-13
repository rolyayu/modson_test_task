import { JsonController, Get, HttpCode, Body, Param, Res, Delete, Put, Patch, } from "routing-controllers";
import CreateMeetUpDto from "./dto/create.dto";
import MeetUp from "./meetups.entity";
import { MeetUpFactory } from "./meetups.factory";
import { IBaseService } from "../interfaces";
import { MeetUpDtoMapper } from "./dto/meetups.mapper";
import { Response } from 'express';
import { SuccessResponse, FailureResponse } from "../responses";

@JsonController('/api/meetups')
export default class MeetupController {
    private meetUpService: IBaseService<MeetUp>;
    constructor() {
        this.meetUpService = new MeetUpFactory().buildService();
    }

    @Get()
    @HttpCode(200)
    async getAll(): Promise<SuccessResponse> {
        const successResp = new SuccessResponse();
        successResp.successCode = 200;
        successResp.data = await this.meetUpService.findAll();
        return successResp;
    }

    @Get("/:id")
    async getMeetUpById(@Param("id") id: number, @Res() response: Response): Promise<SuccessResponse | FailureResponse> {
        const foundedMeetup = await this.meetUpService.findById(id);
        if (!foundedMeetup) {
            response.statusCode = 404;
            const failResp = new FailureResponse();
            failResp.errorCode = 404;
            failResp.message = `Meet up with ${id} id doesn't exists.`
            return failResp;
        } else {
            const successResp = new SuccessResponse();
            successResp.successCode = 200;
            successResp.data = foundedMeetup;
            return successResp;
        }
    }

    @Put()
    @HttpCode(201)
    async createMeetUp(@Body() createDto: CreateMeetUpDto): Promise<SuccessResponse> {
        const successResp = new SuccessResponse();
        successResp.successCode = 201;
        successResp.data = await this.meetUpService.save(MeetUpDtoMapper.mapCreateMeetUpDto(createDto));
        return successResp;
    }

    @Delete("/:id")
    async deleteMeetUpById(@Param("id") id: number, @Res() response: Response): Promise<SuccessResponse | FailureResponse> {
        try {
            await this.meetUpService.deleteById(id);
            const successResp = new SuccessResponse();
            successResp.successCode = 200;
            successResp.data = `Meet up with ${id} id successfully deleted.`;
            return successResp;
        } catch (e) {
            const failResp = new FailureResponse();
            failResp.errorCode = 400;
            failResp.message = `Meet up with ${id} id doesn't exists.`;
            return failResp;
        }
    }

    @Patch()
    async updateMeetUp(@Body() meetUp: MeetUp, @Res() resp: Response): Promise<SuccessResponse | FailureResponse> {
        if (!meetUp.id) {
            resp.statusCode = 400;
            const failResponse = new FailureResponse();
            failResponse.errorCode = 400;
            failResponse.message = `${meetUp} is not persisted. Can't update. If you want to persist meet up, try send Put request.`
            return failResponse;
        }
        else {
            resp.statusCode = 200;
            const successResp = new SuccessResponse();
            successResp.successCode = 200;
            successResp.data = await this.meetUpService.save(meetUp);
            return successResp;
        }
    }
}
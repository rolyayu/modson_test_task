import {
    Authorized,
    Get,
    HttpError,
    JsonController,
    Param,
    Patch,
    QueryParam,
    Res,
} from 'routing-controllers';
import { UserFactory } from './users.factory';
import { IUserService } from './users.service.interface';
import { UserRole } from './users.entity';
import { ResponseUserDto } from './dto/response.user.dto';
import { type FailureResponse, internalError } from '../shared';
import { UserMapper } from './dto/users.mapper';
import { Response } from 'express';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsersOpenAPI } from './users.openapi';

@JsonController('/users')
@Authorized([UserRole.ADMIN])
@OpenAPI(UsersOpenAPI.controller)
export class UserController {
    constructor(private readonly userService: IUserService) {
        this.userService = new UserFactory().buildService();
    }

    @Get()
    @OpenAPI(UsersOpenAPI.findAll)
    @ResponseSchema(ResponseUserDto, {
        isArray:true,
        statusCode:200
    })
    async findAll(
        @QueryParam('startPos', { required: false }) startPos = 0,
        @QueryParam('pageSize', { required: false }) pageSize = 30
    ): Promise<ResponseUserDto[]> {
        const foundedUsers = await this.userService.findAll(startPos, pageSize);
        return foundedUsers.map((user) => UserMapper.mapUserToResponseDto(user));
    }

    @Patch('/:id')
    @OpenAPI(UsersOpenAPI.grantModeratorRole)
    @ResponseSchema(ResponseSchema, {
        statusCode:200,
        description:'Returns user with updated role'
    })
    async grantModeratorRole(
        @Param('id') id: number,
        @Res() res: Response
    ): Promise<ResponseUserDto> {
        const userWithGrantedRole = await this.userService.grantManagerRoleById(id);
        return UserMapper.mapUserToResponseDto(userWithGrantedRole);
    }
}

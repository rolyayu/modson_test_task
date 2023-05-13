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
import { User, UserRole } from './users.entity';
import { type ResponseUserDto } from './dto/response.user.dto';
import { type FailureResponse, internalError, notFound, ok } from '../shared';
import { UserMapper } from './dto/users.mapper';
import { Response } from 'express';
import { UserNotFoundError } from '../shared';
import { Query } from 'typeorm/driver/Query';

@JsonController('/users')
export class UserController {
    constructor(private readonly userService: IUserService) {
        this.userService = new UserFactory().buildService();
    }

    @Get()
    @Authorized([UserRole.ADMIN])
    async findAll(
        @QueryParam('startPos', { required: false }) startPos = 0,
        @QueryParam('pageSize', { required: false }) pageSize = 30
    ): Promise<ResponseUserDto[]> {
        const foundedUsers = await this.userService.findAll(startPos, pageSize);
        return foundedUsers.map((user) => UserMapper.mapUserToResponseDto(user));
    }

    @Patch('/:id')
    @Authorized([UserRole.ADMIN])
    async grantModeratorRole(
        @Param('id') id: number,
        @Res() res: Response
    ): Promise<FailureResponse | ResponseUserDto> {
        try {
            const userWithGrantedRole = await this.userService.grantManagerRoleById(id);
            return UserMapper.mapUserToResponseDto(userWithGrantedRole);
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message,
                };
            }
            return internalError();
        }
    }
}

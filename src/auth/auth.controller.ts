import {
    Authorized,
    Body,
    CookieParam,
    CurrentUser,
    JsonController,
    Post,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { type FailureResponse, created, type SuccessResponse } from '../shared';
import { Request, Response } from 'express';
import { RegisterUserDto, LoginUserDto } from './dto';
import { type IAuthService, AuthService, JwtService } from './';
import { VerifyTokenMiddleware } from '../middlewares';
import { LoggerFactory } from '../utils';
import { type Logger } from 'winston';
import { User } from '../users';
import { constants } from '../shared';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { ResponseUserDto } from '../users/dto';
import { AuthOpenAPI } from './auth.openapi';

@JsonController('/api/auth')
export class AuthController {
    private readonly authService: IAuthService;
    private readonly logger: Logger;
    constructor() {
        this.authService = new AuthService();
        this.logger = LoggerFactory.getLogger('AuthController');
    }

    @Post('/register')
    @ResponseSchema(ResponseUserDto)
    @OpenAPI(AuthOpenAPI.register)
    async register(
        @Body({ validate: true }) register: RegisterUserDto,
        @Res() res: Response
    ): Promise<SuccessResponse | FailureResponse> {
        const registeredUser = await this.authService.register(register);
        this.logger.info(`User with ${registeredUser.username} username just registered.`);
        return created(registeredUser);
    }

    @Post('/login')
    @OpenAPI(AuthOpenAPI.login)
    async login(
        @Body({ validate: true }) login: LoginUserDto,
        @Res() res: Response
    ): Promise<Response | FailureResponse> {
        const tokens = await this.authService.login(login);
        const now = Date.now();
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            expires: new Date(now + constants.refreshCookieMaxAge)
        });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            expires: new Date(now + constants.accessCookieMaxAge)
        });
        this.logger.info(`User ${login.username} logged in.`);
        return res.sendStatus(200);
    }

    @Post('/logout')
    @UseBefore(VerifyTokenMiddleware)
    @Authorized()
    @OpenAPI(AuthOpenAPI.logout)
    logout(@Res() res: Response, @CookieParam('accessToken') accessToken: string) {
        const username = JwtService.extractAccessPayload(accessToken).username;
        this.logger.info(`User ${username} logger out.`);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    }

    @Post('/refresh')
    @UseBefore(VerifyTokenMiddleware)
    @Authorized()
    @OpenAPI(AuthOpenAPI.refresh)
    async refresh(
        @Req() req: Request,
        @Res() res: Response,
        @CookieParam('refreshToken') refreshToken: string,
        @CurrentUser({ required: true }) { username }: User
    ): Promise<Response | FailureResponse> {
        const tokens = await this.authService.refresh(refreshToken);
        const now = Date.now();
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            expires: new Date(now + constants.refreshCookieMaxAge)
        });
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            expires: new Date(now + constants.accessCookieMaxAge)
        });
        this.logger.info(`Updated tokens for ${username}.`);
        return res.sendStatus(200);
    }
}

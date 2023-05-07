import {
    Authorized,
    Body,
    CookieParam,
    CurrentUser,
    HttpError,
    JsonController,
    Post,
    Req,
    Res,
    UseBefore,
} from 'routing-controllers';
import { type FailureResponse, created, type SuccessResponse, internalError } from '../responses';
import { Request, Response } from 'express';
import { RegisterUserDto, LoginUserDto } from '../users/dto';
import { type IAuthService, AuthService, JwtService } from './';
import { VerifyTokenMiddleware } from '../middlewares';
import { LoggerFactory } from '../utils';
import { type Logger } from 'winston';
import { User } from '../users';

@JsonController('/api/auth')
export class AuthController {
    private readonly authService: IAuthService;
    private readonly logger: Logger;
    constructor() {
        this.authService = new AuthService();
        this.logger = LoggerFactory.getLogger('AuthController');
    }

    @Post('/register')
    async register(
        @Body({ validate: true }) register: RegisterUserDto,
        @Res() res: Response
    ): Promise<SuccessResponse | FailureResponse> {
        try {
            const registeredUser = await this.authService.register(register);
            this.logger.info(`User with ${registeredUser.username} username just registered.`);
            return created(registeredUser);
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                this.logger.error(e.message);
                return {
                    errorCode: e.httpCode,
                    message: e.message,
                };
            } else {
                res.statusCode = 500;
                return internalError();
            }
        }
    }

    @Post('/login')
    async login(
        @Body({ validate: true }) login: LoginUserDto,
        @Res() res: Response
    ): Promise<Response | FailureResponse> {
        try {
            const tokens = await this.authService.login(login);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15,
            });
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15,
            });
            this.logger.info(`User ${login.username} logged in.`);
            return res.sendStatus(200);
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                this.logger.error(e.message);
                return {
                    errorCode: e.httpCode,
                    message: e.message,
                };
            } else {
                return internalError();
            }
        }
    }

    @Post('/logout')
    @UseBefore(VerifyTokenMiddleware)
    @Authorized()
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
    async refresh(
        @Req() req: Request,
        @Res() res: Response,
        @CookieParam('refreshToken') refreshToken: string,
        @CurrentUser({ required: true }) { username }: User
    ): Promise<Response | FailureResponse> {
        try {
            const tokens = await this.authService.refresh(refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15,
            });
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15,
            });
            this.logger.info(`Updated tokens for ${username}.`);
            return res.sendStatus(200);
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message,
                };
            } else {
                return internalError();
            }
        }
    }
}

import { Authorized, Body, CookieParam, HttpError, JsonController, Post, Req, Res, UseBefore, } from "routing-controllers";
import { FailureResponse, created, SuccessResponse, internalError } from "../responses";
import { Request, Response } from "express";
import { RegisterUserDto, LoginUserDto } from "../users/dto";
import { IAuthService, AuthService } from "./";
import { VerifyTokenMiddleware } from "../middlewares";

@JsonController('/api/auth')
export class AuthController {
    private readonly authService: IAuthService;
    constructor() {
        this.authService = new AuthService();
    }

    @Post('/register')
    async register(@Body({ validate: true }) register: RegisterUserDto, @Res() res: Response): Promise<SuccessResponse | FailureResponse> {
        try {
            return created(
                await this.authService.register(register)
            );
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message
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
                maxAge: 1000 * 60 * 60 * 24 * 15
            })
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15
            })
            return res.sendStatus(200);
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message
                };
            } else {
                return internalError();
            }
        }
    }

    @Post('/logout')
    @UseBefore(VerifyTokenMiddleware)
    @Authorized()
    logout(
        @Res() res: Response
    ) {
        console.log('Logging out');

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
        @CookieParam("refreshToken") refreshToken: string
    ): Promise<Response | FailureResponse> {
        try {
            const tokens = await this.authService.refresh(refreshToken);
            console.log(req.cookies);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15
            })
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 15
            })
            console.log(res.cookie)
            return res.sendStatus(200);
        } catch (e) {
            if (e instanceof HttpError) {
                res.statusCode = e.httpCode;
                return {
                    errorCode: e.httpCode,
                    message: e.message
                }
            } else {
                return internalError();
            }
        }
    }
}
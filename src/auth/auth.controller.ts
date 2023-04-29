import { Body, HttpError, JsonController, Post, QueryParam, Res } from "routing-controllers";
import { AuthorizationResponse, badRequest, FailureResponse, created, SuccessResponse, internalError } from "../responses";
import { Response } from "express";
import { AuthError } from "../errors/AuthError";
import { RegisterUserDto } from "./users/dto/register.dto";
import { LoginUserDto } from "./users/dto/login.dto";
import { IAuthService } from "./auth.service.interface";
import { AuthService } from "./auth.service";

@JsonController('/api/auth')
export class AuthController {
    private readonly authService: IAuthService;
    constructor() {
        this.authService = new AuthService();
    }

    @Post('/register')
    async register(@Body({ validate: true }) register: RegisterUserDto, @Res() res: Response): Promise<SuccessResponse | FailureResponse> {
        try {
            res.statusCode = 201;
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
    ): Promise<AuthorizationResponse | FailureResponse> {
        try {
            return await this.authService.login(login);
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

    @Post('/refresh')
    async refresh(
        @QueryParam('refresh') token: string,
        @Res() res: Response
    ): Promise<AuthorizationResponse | FailureResponse> {
        try {
            return await this.authService.refresh(token);
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
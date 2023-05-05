import express, { Express, Request } from 'express';
import { Action, RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';

import { JwtService } from '../auth';

import { AuthError } from '../errors';

import { UserFactory, IUserService, User } from '../users';
import { GlobalErrorHanlde } from '../middlewares';
import cookieParser from 'cookie-parser';

export class ExpressServer {
    private static server: Express;
    private static userService: IUserService = new UserFactory().buildService();

    private constructor() { }

    static getServer = (): Express => {
        if (!this.server) {
            const expressServer: Express = express();
            expressServer.use(cookieParser())
            this.server = useExpressServer(expressServer, this.getRoutingControllersParams())
        }
        return this.server;
    }

    private static getRoutingControllersParams = (): RoutingControllersOptions => {
        return {
            controllers: [__dirname + '/../**/*.controller.ts'],
            middlewares: [GlobalErrorHanlde],
            authorizationChecker: this.authChecker(),
            currentUserChecker: this.currentUserChecker(),
            validation: true,
            defaultErrorHandler: false,
        }
    }

    private static currentUserChecker = (): CurrentUserChecker => {
        return async (action: Action): Promise<User | null> => {
            const req: Request = action.request;
            const authHeader = req.header('authorization');
            if (!authHeader) {
                throw new AuthError('Authorize to make this request.')
            }
            const accessToken = JwtService.extractTokenFromHeader(authHeader);
            const payload = JwtService.extractAccessPayload(accessToken);
            if (!JwtService.isAccess(payload)) {
                throw new AuthError('Given token is not access.');
            }
            return await this.userService.findByUsername(payload.username);
        }
    }

    private static authChecker = (): AuthorizationChecker => {
        return async (action: Action, roles: string[]): Promise<boolean> => {
            const req: Request = action.request;
            const authHeader = req.header('Authorization');
            const token = JwtService.extractTokenFromHeader(authHeader!);
            console.log(token);
            const payload = JwtService.extractAccessPayload(token);
            if (!JwtService.isAccess(payload)) {
                return false;
            }
            const user = await this.userService.findByUsername(payload.username);
            if (!user) {
                return false;
            }
            if (!roles) {
                return true;
            }
            if (!roles.find(role => role == user!.role.toString())) {
                return false;
            }
            return true;

        }
    }


}
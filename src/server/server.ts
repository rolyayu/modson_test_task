import express, { Response, type Express, type Request } from 'express';
import { type Action, type RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { type CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';
import { type AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';

import { JwtService } from '../auth';

import { AuthError } from '../errors';

import { UserFactory, type IUserService, type User } from '../users';
import { GlobalErrorHanlder } from '../middlewares';
import cookieParser from 'cookie-parser';

export class ExpressServer {
    private static server: Express;
    private static readonly userService: IUserService = new UserFactory().buildService();

    private constructor() { }

    static getServer = (): Express => {
        if (!this.server) {
            const expressServer: Express = express();
            expressServer.use(cookieParser());
            this.server = useExpressServer(expressServer, this.getRoutingControllersParams());
            this.server.all('*', (req: Request, resp: Response) => {
                resp.status(404).json(`Defunct endpoint ${req.originalUrl} ${req.method}`);
            })
        }
        return this.server;
    };

    private static readonly getRoutingControllersParams = (): RoutingControllersOptions => {
        return {
            controllers: [__dirname + '/../**/*.controller.ts'],
            middlewares: [GlobalErrorHanlder],
            authorizationChecker: this.authChecker(),
            currentUserChecker: this.currentUserChecker(),
            validation: true,
            defaultErrorHandler: false,
        };
    };

    private static readonly currentUserChecker = (): CurrentUserChecker => {
        return async (action: Action): Promise<User | null> => {
            const req: Request = action.request;
            const { accessToken } = req.cookies;
            const payload = JwtService.extractAccessPayload(accessToken);
            return await this.userService.findByUsername(payload.username);
        };
    };

    private static readonly authChecker = (): AuthorizationChecker => {
        return async (action: Action, roles: string[]): Promise<boolean> => {
            const req: Request = action.request;
            const { accessToken } = req.cookies;
            const payload = JwtService.extractAccessPayload(accessToken);
            const user = await this.userService.findByUsername(payload.username);
            if (user == null) {
                return false;
            }
            if (roles.length == 0) {
                return true;
            }
            if (!roles.find((role) => role == user.role)) {
                return false;
            }
            return true;
        };
    };
}

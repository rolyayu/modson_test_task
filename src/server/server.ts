import { Express, Request } from 'express';
import { Action, createExpressServer } from 'routing-controllers';
import { CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';

import { JwtService } from '../auth';

import { AuthError } from '../errors';

import { UserFactory, IUserService, User } from '../users';

export class ExpressServer {
    private static server: Express;
    private static userService: IUserService = new UserFactory().buildService();

    private constructor() { }

    static getServer = (): Express => {
        if (!this.server) {
            this.server = createExpressServer({
                controllers: [__dirname + '/../**/*.controller.ts'],
                authorizationChecker: this.authChecker(),
                currentUserChecker: this.currentUserChecker(),
                validation: true
            });
        }
        return this.server;
    }

    private static currentUserChecker = (): CurrentUserChecker => {
        return async (action: Action): Promise<User | null> => {
            const req: Request = action.request;
            const authHeader = req.header('authorization');
            if (!authHeader) {
                throw new AuthError(402, 'Authorize to make this request.')
            }
            const accessToken = JwtService.extractTokenFromHeader(authHeader);
            const payload = JwtService.extractAccessPayload(accessToken);
            if (!JwtService.isAccess(payload)) {
                throw new AuthError(400, 'Given token is not access.');
            }
            return await this.userService.findByUsername(payload.username);
        }
    }

    private static authChecker = (): AuthorizationChecker => {
        return async (action: Action, roles: string[]): Promise<boolean> => {
            const req: Request = action.request;
            const authHeader = req.header('Authorization');
            if (!authHeader) {
                return false;
            }
            try {
                const token = JwtService.extractTokenFromHeader(authHeader);
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
                if (!roles.find(role => role == user.role.toString())) {
                    return false;
                }
                return true;
            } catch (e) {
                console.log(e)
                return false;
            }
        }
    }
}
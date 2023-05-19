import express, { type Express, type Request } from 'express';
import { type Action, type RoutingControllersOptions, useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { type CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';
import { type AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';

import { JwtService } from '../auth';


import { UserFactory, type IUserService, type User } from '../users';
import { GlobalErrorHanlder } from '../middlewares';
import cookieParser from 'cookie-parser';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import * as swaggerUiExpress from 'swagger-ui-express'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';


export class ExpressServer {
    private static server: Express;
    private static readonly userService: IUserService = new UserFactory().buildService();

    private constructor() { }

    static getServer = (): Express => {
        if (!this.server) {
            const expressServer: Express = express();
            expressServer.use(cookieParser());
            this.server = useExpressServer(expressServer, this.getRoutingControllersParams());

            const schemas = validationMetadatasToSchemas({
                refPointerPrefix: '#/components/schemas/',
            })

            const storage = getMetadataArgsStorage();
            const spec = routingControllersToSpec(storage, this.getRoutingControllersParams(), {
                components: {
                    schemas: {
                        ...schemas,
                        'ListMeetUpDto': {
                            type: 'object',
                            properties: {
                                'totalCount': {
                                    type: 'integer',
                                    minimum: 0
                                },
                                'startPos': {
                                    type: 'integer',
                                    minimum: 0
                                },
                                'pageSize': {
                                    type: 'integer',
                                    minimum: 15
                                },
                                'meetups': {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/ResponseMeetUpDto'
                                    }
                                }
                            },
                            required: [
                                'totalCount',
                                'startPos',
                                'pageSize',
                                'meetups'
                            ]
                        }
                    },
                    securitySchemes: {
                        basicAuth: {
                            scheme: 'basic',
                            type: 'http',
                        },
                        bearerAuth: {
                            scheme: 'bearer',
                            type: 'apiKey',
                            name: 'accessToken'
                        }
                    },
                },
                info: {
                    description: 'Generated with `routing-controllers-openapi`',
                    title: 'Meet ups API',
                    version: '1.0.0',
                },
            })

            this.server.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
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

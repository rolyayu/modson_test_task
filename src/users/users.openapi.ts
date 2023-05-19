import { OpenAPIParam } from "routing-controllers-openapi";
import { getDefaultError } from "../utils";


export const UsersOpenAPI:Record<string,OpenAPIParam> = {
    controller: {
        summary:'For admin only',
    security: [{
        bearerAuth: [],
    }],
         responses: {
            '403': {
                description: 'When non admin user tries to access controller methods',
                content: getDefaultError('Not allowed for non admin', 403)
            }
        }
    },
    findAll: {
        summary: 'Returns page of users ',
        description: 'Returns founded users from start position to start position plus page size',
        parameters: [
            {
                name: 'startPos',
                in: 'query',
                description: 'The starting position of the list.',
                schema: {
                    type: 'integer',
                    default: 0,
                },
            },
            {
                name: 'pageSize',
                in: 'query',
                description: 'The number of items to return in the list.',
                schema: {
                    type: 'integer',
                    default: 30,
                },
            },
        ],
        responses: {
            '401': {
                description: 'Occurs when user is not logged in.',
                content: getDefaultError('Access token is not provided', 401)
            },
        }
    },
    grantModeratorRole: {
        summary: 'Grant moderator role to user by id',
        parameters: [
            {
                in:'path',
                required:true,
                name:'id',
                description:'Id of user to grant moderator role'
            }
        ],
        responses: {
            '404': {
                description: 'Occurs when user with given id not found',
                content: getDefaultError('User with id not found',404)
            }
        }
    }
} 
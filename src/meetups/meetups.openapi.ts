import { OpenAPIParam } from "routing-controllers-openapi";
import { getDefaultError, OkApiResponse } from "../utils";
import { CreateMeetUpDto, UpdateMeetUpDto } from "./dto";

export const MeetupsOpenAPI: Record<string, OpenAPIParam> = {
    controller: {
        summary:'Meetups controller',
        security: [{
        bearerAuth: [],
    }],
    responses: {'401': {
                description: 'Occurs when user is not logged in.',
                content: getDefaultError('Access token is not provided', 401)
            }}
    },
    getAll: {
        summary: 'Returns page of meetups ',
        description: 'Returns object with total meetups count, starting position, page size and founded meetups.',
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
            '200': {
                description: 'User logged in successfully.',
            },
        }
    },
    findById: {
        summary: 'Returns meetups by its id',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Meetup id',
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        ],
        responses: {
            '404': {
                description: 'Occurs when meetup with given id not found.',
                content: getDefaultError('Meetup with id not found', 404)
            }
        }
    },
    createMeetUp: {
        summary: 'Creates meetup',
        description: 'Create meetup if current user is manager',
        requestBody: {
            content: { CreateMeetUpDto }
        },
        responses: {
            '403': {
                description: 'Occurs when non manager user tries to create meetup.',
                content: getDefaultError('Non manager', 403)
            }
        }
    },
    deleteMeetUpByMeetupId: {
        summary:'Delete meetup by its id',
        description:'Delete meetup if current user is manager and owner of this meetup',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Meetup id',
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        ],
        responses: {
            '204': {
                description: 'Meetup deleted successfully',
            },
            '403': {
                description: 'Occurs when non manager user tries to delete meetup or when manager tries to delete not hes meetup',
                content: getDefaultError('Non manager / User cant delete meetup with id', 403)
            }

        }
    },
    updateMeetUpMeetupId: {
        summary: 'Updated meetup by its id',
        description: 'Update meetup by id if current user is manager and owner of this meetup',
        requestBody: {
            content: { UpdateMeetUpDto }
        },
         parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Meetup id',
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        ],
        responses: {
            '403': {
                description: 'Occurs when non manager user tries to update meetup or when manager tries to update not hes meetup',
                content: getDefaultError('Non manager / User cant delete meetup with id', 403)
            }
        }
    }
};
import { OpenAPIParam } from "routing-controllers-openapi";
import { LoginUserDto, RegisterUserDto } from "./dto";
import { OkApiResponse, stringApiResponse } from "../utils";

export const AuthOpenAPI: Record<string, OpenAPIParam> = {
    register: {
        summary: 'Register user',
        requestBody: {
            content: {
                RegisterUserDto
            }
        },
        responses: {
            '200': {
                description: 'Registered successfully. Granted role user my default.'
            },
            '401': {
                description: 'Occurs when username is already taken.',
                content: stringApiResponse(`User with username already exists.`)
            },
        }
    },

    login: {
        summary: 'Login user',
        description: 'Login user and save access and refresh tokens into HttpOnly cookies',
        requestBody: {
            content: {
                LoginUserDto
            }
        },
        responses: {
            '200': {
                description: 'User logged in successfully.',
                content: OkApiResponse()
            },
            '401': {
                description: 'Occurs when username is not exists.',
                content: stringApiResponse(`User with username doesn't exists.`)
            }
        }
    },

    refresh: {
        summary: 'Refresh tokens',
        description: 'Tooks tokens from cookies, validate and refresh them. Then store in HttpOnly cookies',
        responses: {
            '200': {
                description: 'Tokens refreshed successfully',
                content: OkApiResponse()
            },
            '401': {
                description: 'Occurs when user is not logged.',
                content: stringApiResponse('Access token is not provided.')
            }
        }
    },

    logout: {
        summary: 'Log out user',
        description: 'Log out  user via deleting tokens from cookies',
        responses: {
            '200': {
                description: 'User logged in successfully.',
                content: OkApiResponse()
            },
            '401': {
                description: 'Occurs when user is not logged in.',
                content: stringApiResponse(`User is not logged in.`)
            }
        }
    }
} as const;
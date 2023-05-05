import { FailureResponse } from "./failure.response";

export const badRequest = (message: string, name: string = 'Bad Request'): FailureResponse => {
    return {
        errorCode: 400,
        message,
        name
    }
}

export const unauthorized = (message: string, name = 'Unathorized'): FailureResponse => {
    return {
        errorCode: 401,
        message,
        name
    }
}

export const forbidden = (message: string, name: string = 'Forbidden'): FailureResponse => {
    return {
        errorCode: 403,
        message,
        name
    }
}
export const notFound = (message: string, name: string = 'Not Found'): FailureResponse => {
    return {
        errorCode: 404,
        message,
        name
    }
}
export const internalError = (): FailureResponse => {
    return {
        errorCode: 500,
        message: 'Something bad has occured.'
    }
}


import { type Request, type Response } from 'express';
import { type ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { internalError } from '../responses';

@Middleware({ type: 'after' })
export class GlobalErrorHanlde implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: (err?: any) => any): void {
        if (error instanceof HttpError) {
            response.status(error.httpCode).json({
                errorCode: error.httpCode,
                message: error.message,
                name: error.name,
            });
        } else if (error instanceof Error) {
            response.status(500).json(error.message);
        } else {
            response.status(500).json(internalError());
        }
    }
}

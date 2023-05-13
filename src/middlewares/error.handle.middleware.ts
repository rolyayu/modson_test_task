import { type Request, type Response } from 'express';
import { type ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { internalError } from '../shared';
import { Logger } from 'winston';
import { LoggerFactory } from '../utils';

@Middleware({ type: 'after' })
export class GlobalErrorHanlder implements ExpressErrorMiddlewareInterface {
    private readonly logger: Logger;
    constructor() {
        this.logger = LoggerFactory.getLogger('GlobalErrorHanlder');
    }
    error(error: any, request: Request, response: Response, next: (err?: any) => any): void {
        if (error instanceof HttpError) {
            this.logger.error(`${error.message} [${error.httpCode}]`)
            response.status(error.httpCode).json({
                errorCode: error.httpCode,
                message: error.message,
                name: error.name,
            });
        } else if (error instanceof Error) {
            this.logger.error(error.message);
            response.status(500).json(error.message);
        } else {
            this.logger.error(`Unhandle error: ${error}`)
            response.status(500).json(internalError());
        }
    }
}

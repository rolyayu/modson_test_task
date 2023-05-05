import { Middleware, ExpressMiddlewareInterface, HttpError } from 'routing-controllers'
import { Response, Request, NextFunction } from 'express'
import { JwtService } from '../auth';
import { internalError, unauthorized } from '../responses';

Middleware({ type: 'before' })
export class VerifyTokenMiddleware implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: NextFunction) {
        const { accessToken } = request.cookies;
        try {
            const isTokenValid = JwtService.isAccessTokenValid(accessToken);
            if (!isTokenValid) {
                response.status(401).json(unauthorized('Access token is not valid'));
                return;
            }
            next();
        } catch (e) {
            if (e instanceof HttpError) {
                response.status(e.httpCode).json({
                    message: e.message,
                    name: e.name
                })
                return;
            } else {
                response.status(500).json(internalError());
                return;
            }
        }
    }

}
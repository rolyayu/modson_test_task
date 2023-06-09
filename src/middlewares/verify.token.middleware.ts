import { Middleware, type ExpressMiddlewareInterface, HttpError } from 'routing-controllers';
import { type Response, type Request, type NextFunction } from 'express';
import { JwtService } from '../auth';
import { internalError, unauthorized } from '../shared';

Middleware({ type: 'before' });
export class VerifyTokenMiddleware implements ExpressMiddlewareInterface {
    use(request: Request, response: Response, next: NextFunction) {
        const { accessToken } = request.cookies;
        if (!accessToken) {
            response.status(401).json(unauthorized('Access token is not given.'));
            return;
        }
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
                    name: e.name,
                });
            } else {
                response.status(500).json(internalError());
            }
        }
    }
}

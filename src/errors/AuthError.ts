import { HttpError } from "routing-controllers";

export class AuthError extends HttpError {
    constructor(message: string) {
        super(401, message);
    }
}
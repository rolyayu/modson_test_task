import { HttpError } from 'routing-controllers';

export class NotAllowedError extends HttpError {
    constructor(messsage: string) {
        super(403, messsage);
    }
}

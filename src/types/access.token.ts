import { type JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
    username: string;
    // userRoles: string[];
}

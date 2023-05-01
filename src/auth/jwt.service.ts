import { AuthError } from "../errors/AuthError";
import configEnv from "../utils/dotenv.config";
import { sign, verify, JwtPayload, JsonWebTokenError } from 'jsonwebtoken';
import { AccessTokenPayload } from "./tokens/access.token";
import { RefreshTokenPayload } from "./tokens/refresh.token";
import { User } from "../users";

export type TokensPair = {
    accessToken: string,
    refreshToken: string
}

export class JwtService {

    static generateTokensForUser = (user: User): TokensPair => {
        const accessToken = this.generateAccessTokenForUser(user);

        const refreshToken = this.generateRefreshTokenForUser(user);
        return {
            accessToken,
            refreshToken
        };
    }

    private static generateAccessTokenForUser = ({ role, username }: User): string => {
        const accessPayload: AccessTokenPayload = {
            username,
        };
        return sign(accessPayload, JwtService.getAccessSecretKey(), {
            expiresIn: '15 mins'
        });
    }

    private static generateRefreshTokenForUser = ({ id }: User): string => {
        const refreshPayload: RefreshTokenPayload = {
            userId: id,
        }
        return sign(refreshPayload, JwtService.getRefreshSecretKey(), {
            expiresIn: '30 days'
        })
    }

    static extractTokenFromHeader = (authHeader: string): string => {
        const parts = authHeader.split(' ');
        if (!parts) {
            throw new AuthError(401, 'Request must contains Bearer and token devided by space.')
        } else if (parts[0] != 'Bearer') {
            throw new AuthError(401, 'Auth header doesn\'t contain Bearer.')
        }
        return parts[1];
    }

    static isAccessTokenValid = (token: string) => {
        return this.isTokenValid(token, this.getAccessSecretKey());
    }

    static isRefreshTokenValid = (token: string) => {
        return this.isTokenValid(token, this.getRefreshSecretKey());
    }

    private static isTokenValid = (token: string, key: string): boolean => {
        try {
            verify(token, key);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    static extractRefreshPayload = (token: string): JwtPayload => {
        return verify(token, this.getRefreshSecretKey()) as JwtPayload;
    }

    static extractAccessPayload = (token: string): JwtPayload => {
        return verify(token, this.getAccessSecretKey()) as JwtPayload;
    }

    private static getAccessSecretKey = (): string => {
        configEnv();
        const secret = process.env.ACCESS_SECRET_KEY;
        if (!secret) {
            throw new Error('Access key is not provided');
        }
        return secret;
    }

    private static getRefreshSecretKey = (): string => {
        configEnv();
        const secret = process.env.REFRESH_SECRET_KEY;
        if (!secret) {
            throw new Error('Refresh key is not provided');
        }
        return secret;
    }

    static isRefresh(payload: JwtPayload): payload is RefreshTokenPayload {
        return 'userId' in payload;
    }

    static isAccess(payload: JwtPayload): payload is AccessTokenPayload {
        return 'username' in payload;
    }

    static getAccessTokenExp(token: string): number {
        const exp = this.extractAccessPayload(token).exp;
        if (!exp) {
            throw new JsonWebTokenError(`Token doesn't have expiration time.`)
        } else {
            return exp;
        }
    }
}
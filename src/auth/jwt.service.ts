import { AuthError } from '../errors/AuthError';
import configEnv from '../utils/dotenv.config';
import { sign, verify, type JwtPayload, JsonWebTokenError } from 'jsonwebtoken';
import { type AccessTokenPayload, type TokensPair, type RefreshTokenPayload } from './../types';
import { type User } from '../users';
import { constants } from '../shared';

export class JwtService {
    static generateTokensForUser = (user: User): TokensPair => {
        const accessToken = this.generateAccessTokenForUser(user);

        const refreshToken = this.generateRefreshTokenForUser(user);
        return {
            accessToken,
            refreshToken,
        };
    };

    private static readonly generateAccessTokenForUser = ({ username }: User): string => {
        const accessPayload: AccessTokenPayload = {
            username,
        };
        return sign(accessPayload, JwtService.getAccessSecretKey(), {
            expiresIn: constants.accessTokenExpiration,
        });
    };

    private static readonly generateRefreshTokenForUser = ({ id }: User): string => {
        const refreshPayload: RefreshTokenPayload = {
            userId: id,
        };
        return sign(refreshPayload, JwtService.getRefreshSecretKey(), {
            expiresIn: constants.refreshTokenExpiration,
        });
    };

    static isAccessTokenValid = (token: string) => {
        return this.isTokenValid(token, this.getAccessSecretKey());
    };

    static isRefreshTokenValid = (token: string) => {
        return this.isTokenValid(token, this.getRefreshSecretKey());
    };

    private static readonly isTokenValid = (token: string, key: string): boolean => {
        try {
            verify(token, key);
            return true;
        } catch (e) {
            return false;
        }
    };

    static extractRefreshPayload = (token: string): JwtPayload => {
        return verify(token, this.getRefreshSecretKey()) as JwtPayload;
    };

    static extractAccessPayload = (token: string): JwtPayload => {
        return verify(token, this.getAccessSecretKey()) as JwtPayload;
    };

    private static readonly getAccessSecretKey = (): string => {
        configEnv();
        const secret = process.env.ACCESS_SECRET_KEY;
        if (!secret) {
            throw new Error('Access key is not provided');
        }
        return secret;
    };

    private static readonly getRefreshSecretKey = (): string => {
        configEnv();
        const secret = process.env.REFRESH_SECRET_KEY;
        if (!secret) {
            throw new Error('Refresh key is not provided');
        }
        return secret;
    };

    static getAccessTokenExp(token: string): number {
        const exp = this.extractAccessPayload(token).exp;
        if (!exp) {
            throw new JsonWebTokenError(`Token doesn't have expiration time.`);
        } else {
            return exp;
        }
    }

    static getRefreshTokenExp(token: string): number {
        const exp = this.extractRefreshPayload(token).exp;
        if (!exp) {
            throw new JsonWebTokenError(`Token doesn't have expiration time.`);
        } else {
            return exp;
        }
    }
}

import { AuthError } from "../errors/AuthError";
import configEnv from "../utils/dotenv.config";
import { sign, verify, decode, JwtPayload, JsonWebTokenError } from 'jsonwebtoken';
import { AccessTokenPayload } from "./tokens/access.token";
import { RefreshTokenPayload } from "./tokens/refresh.token";
import { User } from "./users/users.entity";

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
        const accessTokenExpiration = Date.now() + 1000 * 60 * 15;
        const accessPayload: AccessTokenPayload = {
            username,
            exp: accessTokenExpiration
        };
        return sign(accessPayload, JwtService.getSecretKey());
    }

    private static generateRefreshTokenForUser = ({ id }: User): string => {
        const refreshTokenExpiration = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const refreshPayload: RefreshTokenPayload = {
            userId: id,
            exp: refreshTokenExpiration
        }
        return sign(refreshPayload, JwtService.getSecretKey())
    }

    static extractTokenFromHeader = (authHeader: string): string => {
        const parts = authHeader.split(' ');
        if (!parts) {
            throw new AuthError(400, 'Request must contains Bearer and token devided by space.')
        } else if (parts[0] != 'Bearer') {
            throw new AuthError(400, 'Auth header doesn\'t contain Bearer.')
        }
        return parts[1];
    }

    static isTokenValid(token: string): boolean {
        try {
            verify(token, JwtService.getSecretKey());
            return true;
        } catch (e) {
            return false;
        }
    }

    static extractPayload(token: string): JwtPayload {
        return verify(token, this.getSecretKey()) as JwtPayload;
    }

    private static getSecretKey = (): string => {
        configEnv();
        const secret = process.env.SECRET_KEY || 'omega lol';
        return secret;
    }

    static isRefresh(payload: JwtPayload): payload is RefreshTokenPayload {
        return 'userId' in payload;
    }

    static isAccess(payload: JwtPayload): payload is AccessTokenPayload {
        return 'username' in payload;
    }

    static getExp(token: string): number {
        const exp = this.extractPayload(token).exp;
        if (!exp) {
            throw new JsonWebTokenError(`Token doesn't have expiration time.`)
        } else {
            return exp;
        }
    }
}
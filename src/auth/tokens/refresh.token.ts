import { JwtPayload } from "jsonwebtoken";

export interface RefreshTokenPayload extends JwtPayload {
    userId: number;
}
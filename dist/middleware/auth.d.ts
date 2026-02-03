import { Request, Response, NextFunction } from "express";
export interface JwtPayloadCustom {
    id_user: string;
    username: string;
    iat: number;
    exp: number;
}
export type AuthedRequest = Request & {
    user?: JwtPayloadCustom;
    token?: string;
};
export declare const authMiddleware: (req: AuthedRequest, res: Response, next: NextFunction) => void;

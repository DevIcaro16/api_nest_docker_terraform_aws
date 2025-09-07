import { FastifyRequest } from "fastify";

export interface JWTPayload {
    sub: string;
    name: string;
    email: string;
    exp: number;
    iat: number;
    aud: string;
}

export type AuthenticatedRequest = {
    userID: string;
} & FastifyRequest;
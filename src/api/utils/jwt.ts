import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload
    extends JwtPayload {

    userId: number;
    role: string;

}
const SECRET = process.env.JWT_SECRET!;

export function signToken(payload: any) {
    return jwt.sign(payload, SECRET, {
        expiresIn: "7d",
    });
}

export function verifyToken(
    token: string
        ): TokenPayload {

        const decoded =
            jwt.verify(
            token,
            SECRET
            );

        if (typeof decoded === "string")
            throw new Error(
            "Invalid token"
            );

    return decoded as TokenPayload;
}
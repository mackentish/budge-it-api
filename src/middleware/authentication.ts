import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User, UserType } from '../models';

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let token = req.get('authorization');
        if (!token) {
            return res.status(404).json('Token not found');
        }
        token = token.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        next();
    } catch (error) {
        return res.status(401).json('Unauthorized access');
    }
}

export function verifyRefresh(token: string, email: string) {
    try {
        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!
        ) as { email: string };
        return decoded.email === email;
    } catch (error) {
        return false;
    }
}

export async function getUserFromToken(req: Request): Promise<UserType> {
    let token = req.get('authorization');
    if (!token) {
        throw new Error('Token not found');
    }
    token = token.split(' ')[1];
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
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

function verifyRefresh(token: string) {
    try {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        return true;
    } catch (error) {
        return false;
    }
}

export { isAuthenticated, verifyRefresh };

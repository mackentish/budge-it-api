import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    console.log('test', req.get('authorization'));
    try {
        let token = req.get('authorization');
        if (!token) {
            return res.status(404).json('Token not found');
        }
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        req.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json('Unauthorized access');
    }
}

function verifyRefresh(email, token) {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        return decoded.email === email;
    } catch (error) {
        return false;
    }
}

export { isAuthenticated, verifyRefresh };

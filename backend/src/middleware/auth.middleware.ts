import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'emergency_fallback_secret_for_stability_only';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('[SECURITY WARNING] Running with fallback JWT_SECRET. Ensure environment variables are set.');
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
    file?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, data: null, error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as any;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, data: null, error: 'Invalid token' });
    }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as any;
        req.user = decoded;
    } catch (err) {
        // Ignore invalid token in optional mode
    }
    next();
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, data: null, error: 'Forbidden' });
        }
        next();
    };
};

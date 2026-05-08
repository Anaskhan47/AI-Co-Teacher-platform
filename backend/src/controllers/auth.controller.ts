import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role } = req.body;
        console.log("[AUTH] Registration Attempt Started:", { email, name, role });

        if (!email || !password || !name) {
            console.warn("[AUTH] Registration Failed: Missing fields");
            return res.status(400).json({ success: false, data: null, error: 'Missing required fields' });
        }

        console.log("[AUTH] Checking for existing user...");
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.warn("[AUTH] Registration Failed: User exists", email);
            return res.status(400).json({ success: false, data: null, error: 'User already exists' });
        }

        console.log("[AUTH] Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("[AUTH] Creating new user in DB...");
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: (role as any) || 'TEACHER',
            }
        });

        console.log("[AUTH] Generating JWT token...");
        const token = jwt.sign({ id: newUser.id, email, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

        console.log("[AUTH] Registration Successful:", email);
        res.status(201).json({
            success: true,
            data: {
                token,
                user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
            },
            error: null
        });
    } catch (error: any) {
        console.error("[AUTH] CRITICAL REGISTRATION ERROR:", error);
        res.status(500).json({ 
            success: false,
            data: null,
            error: error.message || 'Internal server error'
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ success: false, data: null, error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, data: null, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role }
            },
            error: null
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    res.status(501).json({ success: false, data: null, error: 'Google Login is currently disabled due to Firebase removal.' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ success: false, data: null, error: 'User not found' });
        }

        res.json({ success: true, data: { id: user.id, email: user.email, name: user.name, role: user.role }, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
    }
};

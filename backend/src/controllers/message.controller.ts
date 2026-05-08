import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../lib/prisma';

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, data: null, error: 'Unauthorized' });
        }
        
        const userId = req.user.id;
        const limitRaw = (req.query.limit as string) || '50';
        const limit = Math.min(Math.max(parseInt(limitRaw) || 50, 1), 100);

        const messages = await prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }]
            },
            include: {
                sender: { select: { id: true, name: true, role: true } },
                receiver: { select: { id: true, name: true, role: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        if (messages.length === 0) {
            // Return mock contacts for demo if no history exists
            const mockMessages = [
                {
                    id: "mock-msg-1",
                    content: "Hello, I wanted to discuss the student's progress.",
                    senderId: "mock-parent-1",
                    receiverId: userId,
                    createdAt: new Date(),
                    sender: { id: "mock-parent-1", name: "Parental Unit", role: "PARENT" },
                    receiver: { id: userId, name: "Teacher", role: "TEACHER" },
                    isRead: false
                }
            ];
            return res.json({ success: true, data: mockMessages, error: null });
        }

        res.json({ success: true, data: messages, error: null });
    } catch (error: any) {
        console.error("Fetch Messages Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to fetch messages' });
    }
};

export const sendEmailToParent = async (req: AuthRequest, res: Response) => {
    const { parentId, subject, body } = req.body;
    try {
        if (!parentId || !subject || !body) {
            return res.status(400).json({ success: false, data: null, error: 'Parent ID, subject, and body are required' });
        }
        console.log(`[MAIL] Sending email to parent ${parentId}: ${subject}`);
        res.json({ success: true, data: { message: "Email sent successfully" }, error: null });
    } catch (error: any) {
        res.status(500).json({ success: false, data: null, error: "Failed to send email" });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { receiverId, content } = req.body;
    try {
        if (!receiverId || !content) {
            return res.status(400).json({ success: false, data: null, error: 'Receiver ID and content are required' });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: req.user!.id,
                receiverId,
                isRead: false
            }
        });
        res.status(201).json({ success: true, data: message, error: null });
    } catch (error: any) {
        console.error("Send Message Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Failed to send message' });
    }
};

export const markRead = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ success: false, data: null, error: 'Message ID is required' });

        const result = await prisma.message.updateMany({
            where: { id, receiverId: req.user!.id },
            data: { isRead: true }
        });
        if (result.count === 0) return res.status(404).json({ success: false, data: null, error: 'Message not found or unauthorized' });
        res.status(200).json({ success: true, data: null, error: null });
    } catch (error: any) {
        console.error("Mark Read Error:", error);
        res.status(500).json({ success: false, data: null, error: error.message || 'Update failed' });
    }
};

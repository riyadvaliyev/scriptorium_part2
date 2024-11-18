import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const user = verifyToken(req, res);
    if (!user) return; // Unauthorized if no valid token
  
    const { postId, text } = req.body;
  
    try {
      const comment = await prisma.comment.create({
        data: {
          text,
          postId,
          authorId: user.id,
        },
      });
  
      res.status(201).json(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
}
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user) return; // Unauthorized if no valid token

  const { postId, text, parentId } = req.body;

  try {
    const reply = await prisma.comment.create({
      data: {
        text,
        postId,
        authorId: user.id,
        parentId,
      },
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
}
// src/pages/api/admin/toggleVisibility.ts
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/verifyToken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { contentType, id, hidden } = req.body;

  if (!['BlogPost', 'Comment'].includes(contentType) || !id) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    if (contentType === 'BlogPost') {
      await prisma.blogPost.update({
        where: { id: parseInt(id, 10) },
        data: { hidden },
      });
    } else if (contentType === 'Comment') {
      await prisma.comment.update({
        where: { id: parseInt(id, 10) },
        data: { hidden },
      });
    }

    res.status(200).json({ message: 'Visibility toggled successfully' });
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({ error: 'Failed to toggle visibility' });
  }
}

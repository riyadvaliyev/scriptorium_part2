// src/pages/api/blog/getPostById.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        tags: true,
        codeTemplateLinks: true,
        author: { select: { firstName: true, lastName: true } },
      },
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json({ post });
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
}

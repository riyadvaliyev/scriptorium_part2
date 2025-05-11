import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { codeTemplateId } = req.query;
  
    try {
      const posts = await prisma.blogPost.findMany({
        where: {
          codeTemplateLinks: {
            some: { id: parseInt(codeTemplateId) }, // Match posts linked to this code template
          },
        },
        select: {
          id: true,
          title: true,
          content: true, // TO DO for later: we might want to limit the preview size on the frontend for longer content
          createdAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching blog posts for code template:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  }
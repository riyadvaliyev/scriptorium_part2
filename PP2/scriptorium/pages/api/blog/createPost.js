import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const user = verifyToken(req, res);
    if (!user) return; // Unauthorized if no valid token
  
    const { title, content, tags, codeTemplateIds } = req.body;
  
    try {
      // Step 1: Handle tags for the BlogPost
      const blogTagConnections = await Promise.all(
        tags.map(async (tag) => {
          const existingTag = await prisma.tag.findUnique({
            where: { name: tag.name },
          });
          return existingTag
            ? { id: existingTag.id }
            : await prisma.tag.create({ data: { name: tag.name } });
        })
      );
  
      // Step 2: Create the BlogPost with tags
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          content,
          authorId: user.id,
          tags: {
            connect: blogTagConnections.map(tag => ({ id: tag.id })),
          },
        },
      });
  
      // Step 3: Fetch existing CodeTemplate records
      if (codeTemplateIds && codeTemplateIds.length > 0) {
        const existingCodeTemplates = await prisma.codeTemplate.findMany({
          where: {
            id: { in: codeTemplateIds },
          },
        });
  
        if (existingCodeTemplates.length > 0) {
          await prisma.blogPost.update({
            where: { id: newPost.id },
            data: {
              codeTemplateLinks: {
                connect: existingCodeTemplates.map(template => ({ id: template.id })),
              },
            },
          });
        }
      }
  
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
}
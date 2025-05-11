import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user) return; // Unauthorized if no valid token

  const { postId, title, content, tags, codeTemplateIds } = req.body;

  try {
    // Step 1: Check if the post belongs to the user
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (!post || post.authorId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Step 2: Process tags - Fetch existing or create new ones
    const tagConnections = await Promise.all(
      tags.map(async (tag) => {
        const existingTag = await prisma.tag.findUnique({
          where: { name: tag.name },
        });
        return existingTag
          ? { id: existingTag.id }
          : await prisma.tag.create({ data: { name: tag.name } });
      })
    );

    // Step 3: Update the BlogPost with title, content, and tags
    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title,
        content,
        tags: {
          set: [], // Clear existing tags
          connect: tagConnections.map(tag => ({ id: tag.id })), // Connect new tags
        },
      },
    });

    // Step 4: Fetch existing CodeTemplate records
    if (codeTemplateIds && codeTemplateIds.length > 0) {
      const existingCodeTemplates = await prisma.codeTemplate.findMany({
        where: {
          id: { in: codeTemplateIds },
        },
      });

      // Only connect if there are existing templates to link
      if (existingCodeTemplates.length > 0) {
        await prisma.blogPost.update({
          where: { id: postId },
          data: {
            codeTemplateLinks: {
              set: [], // Clear existing links
              connect: existingCodeTemplates.map(template => ({ id: template.id })),
            },
          },
        });
      }
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
}

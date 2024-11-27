import { PrismaClient } from '@prisma/client';
import CreateBlogPost from "@/components/Dashboard/CreateBlogPost";
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user) return; // Unauthorized if no valid token

  const { title, content, tags, codeTemplateIds } = req.body; // Using `codeTemplateIds`

  try {
    // Step 1: Parse and validate tags
    const formattedTags = Array.isArray(tags)
      ? tags.map(tag => (typeof tag === 'string' ? { name: tag.trim() } : tag))
      : [];

    // Step 2: Handle tags for the BlogPost
    const blogTagConnections = await Promise.all(
      formattedTags.map(async (tag) => {
        const existingTag = await prisma.tag.findUnique({
          where: { name: tag.name },
        });
        return existingTag
          ? { id: existingTag.id }
          : await prisma.tag.create({ data: { name: tag.name } });
      })
    );

    // Step 3: Create the BlogPost
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

    // Step 4: Link CodeTemplates to the BlogPost
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

    // Fetch the updated post to verify linked templates
    const updatedPost = await prisma.blogPost.findUnique({
      where: { id: newPost.id },
      include: { codeTemplateLinks: true },
    });
    
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
}



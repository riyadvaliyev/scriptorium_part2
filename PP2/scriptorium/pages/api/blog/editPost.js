import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user) return; // Unauthorized if no valid token

  const { postId, title, content, tags, codeTemplateIds, codeTemplateLinks} = req.body;

  try {
    const numericPostId = parseInt(postId, 10);
    console.log(req.body);

    // Step 1: Check if the post belongs to the user
    const post = await prisma.blogPost.findUnique({
      where: { id: numericPostId },
    });
    if (!post || post.authorId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Ensure `tags` is an array before proceeding
    const normalizedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(",").map((tag) => ({ name: tag.trim() })) // If tags are a comma-separated string, split them
    : [];

    // Step 2: Process tags - Fetch existing or create new ones
    const tagConnections = await Promise.all(
    normalizedTags.map(async (tag) => {
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
      where: { id: numericPostId },
      data: {
        title,
        content,
        tags: {
          set: [], // Clear existing tags
          connect: tagConnections.map(tag => ({ id: tag.id })), // Connect new tags
        },
      },
    });

    // // Step 4: Fetch existing CodeTemplate records
    // if (codeTemplateIds && codeTemplateIds.length > 0) {
    //   const existingCodeTemplates = await prisma.codeTemplate.findMany({
    //     where: {
    //       id: { in: codeTemplateIds },
    //     },
    //   });
      
    //   // Only connect if there are existing templates to link
    //   if (existingCodeTemplates.length > 0) {
    //     await prisma.blogPost.update({
    //       where: { id: Number(postId) },
    //       data: {
    //         codeTemplateLinks: {
    //           set: [], // Clear existing links
    //           connect: existingCodeTemplates.map(template => ({ id: template.id })),
    //         },
    //       },
    //     });
    //   }
    // }
    // Step 4: Fetch existing CodeTemplate records
    if (codeTemplateLinks && codeTemplateLinks.length > 0) {
      // Clear existing links and connect only the updated templates
      await prisma.blogPost.update({
        where: { id: Number(postId) },
        data: {
          codeTemplateLinks: {
            set: [], // Clear existing links
            connect: codeTemplateLinks.map((id) => ({ id })), // Connect updated templates
          },
        },
      });
    }
    console.log(updatedPost);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
}

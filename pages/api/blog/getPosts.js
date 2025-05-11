import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { searchTerm } = req.query;

  try {
    // Step 1: Handle empty or undefined search term
    const terms = searchTerm ? (Array.isArray(searchTerm) ? searchTerm : [searchTerm]) : [];
    const whereClause = terms.length
      ? {
          OR: terms.flatMap((term) => [
            { title: { contains: term, mode: 'insensitive' } },
            { content: { contains: term, mode: 'insensitive' } },
            { tags: { some: { name: { contains: term, mode: 'insensitive' } } } },
            { codeTemplateLinks: { some: { title: { contains: term, mode: 'insensitive' } } } },
          ]),
        }
      : {}; // No filter if no search term provided

    // Step 2: Fetch all blog posts matching the criteria
    const blogPosts = await prisma.blogPost.findMany({
      where: whereClause,
      include: {
        tags: true,
        author: { select: { firstName: true, lastName: true } },
        codeTemplateLinks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      posts: blogPosts, // Return all posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
}
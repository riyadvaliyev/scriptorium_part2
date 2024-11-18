import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { searchTerm, page = 1, pageSize = 10 } = req.query;

  try {
    // Step 1: Define the search criteria for multiple search terms
    const terms = Array.isArray(searchTerm) ? searchTerm : [searchTerm];
    const whereClause = terms.length
      ? {
          OR: terms.flatMap(term => [
            { title: { contains: term, lte: 'insensitive' } },
            { content: { contains: term, lte: 'insensitive' } },
            { tags: { some: { name: { contains: term, lte: 'insensitive' } } } },
            { codeTemplateLinks: { some: { title: { contains: term, lte: 'insensitive' } } } },
          ]),
        }
      : {};

    // Step 2: Fetch blog posts with pagination
    const blogPosts = await prisma.blogPost.findMany({
      where: whereClause,
      include: {
        tags: true,
        codeTemplateLinks: true,
      },
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize),
      orderBy: { createdAt: 'desc' },
    });

    // Step 3: Get total count for pagination
    const totalPosts = await prisma.blogPost.count({ where: whereClause });
    const totalPages = Math.ceil(totalPosts / pageSize);

    res.status(200).json({
      posts: blogPosts,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPosts,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
}
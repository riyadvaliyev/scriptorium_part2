// pages/api/blog/listByRating.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { page = 1, pageSize = 10 } = req.query; // Defaults to page 1, 10 items per page
  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);

  try {
    const blogPosts = await prisma.blogPost.findMany({
      skip,
      take,
      orderBy: [
        {
          upvotes: 'desc',
        },
        {
          downvotes: 'asc',
        },
      ],
      select: {
        id: true,
        title: true,
        content: true,
        upvotes: true,
        downvotes: true,
        createdAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Fetch total count for pagination metadata
    const totalPosts = await prisma.blogPost.count();
    const totalPages = Math.ceil(totalPosts / pageSize);

    res.status(200).json({
      data: blogPosts,
      meta: {
        currentPage: parseInt(page),
        pageSize: take,
        totalPages,
        totalItems: totalPosts,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts by rating:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts by rating' });
  }
}

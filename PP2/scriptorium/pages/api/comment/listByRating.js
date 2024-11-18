// pages/api/comment/listByRating.js
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
    const comments = await prisma.comment.findMany({
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
        text: true,
        upvotes: true,
        downvotes: true,
        createdAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Fetch total count for pagination metadata
    const totalComments = await prisma.comment.count();
    const totalPages = Math.ceil(totalComments / pageSize);

    res.status(200).json({
      data: comments,
      meta: {
        currentPage: parseInt(page),
        pageSize: take,
        totalPages,
        totalItems: totalComments,
      },
    });
  } catch (error) {
    console.error('Error fetching comments by rating:', error);
    res.status(500).json({ error: 'Failed to fetch comments by rating' });
  }
}

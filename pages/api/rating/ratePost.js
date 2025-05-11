// pages/api/rating/ratePost.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user) return; // Unauthorized if no valid token

  const { postId, ratingValue } = req.body; // ratingValue: 0 for downvote, 1 for upvote

  if (![0, 1].includes(ratingValue)) {
    return res.status(400).json({ error: 'Invalid rating value' });
  }

  try {
    // Check if user has already rated this post
    const existingRating = await prisma.rating.findFirst({
      where: { userId: user.id, blogPostId: postId },
    });

    let updatedPost;

    if (existingRating) {
      // If rating exists, update the upvotes/downvotes count
      if (existingRating.ratingValue !== ratingValue) {
        updatedPost = await prisma.blogPost.update({
          where: { id: postId },
          data: {
            upvotes: { increment: ratingValue === 1 ? 1 : -1 },
            downvotes: { increment: ratingValue === 0 ? 1 : -1 },
          },
        });
        
        // Update the rating record
        await prisma.rating.update({
          where: { id: existingRating.id },
          data: { ratingValue },
        });
      }
    } else {
      // Create a new rating and update the counts
      await prisma.rating.create({
        data: {
          ratingValue,
          userId: user.id,
          blogPostId: postId,
        },
      });

      updatedPost = await prisma.blogPost.update({
        where: { id: postId },
        data: {
          upvotes: { increment: ratingValue === 1 ? 1 : 0 },
          downvotes: { increment: ratingValue === 0 ? 1 : 0 },
        },
      });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error rating post:', error);
    res.status(500).json({ error: 'Failed to rate post' });
  }
}

// pages/api/rating/rateComment.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req, res);
  if (!user) return; // Unauthorized if no valid token

  const { commentId, ratingValue } = req.body; // ratingValue: 0 for downvote, 1 for upvote

  if (![0, 1].includes(ratingValue)) {
    return res.status(400).json({ error: 'Invalid rating value' });
  }

  try {
    // Check if user has already rated this comment
    const existingRating = await prisma.rating.findFirst({
      where: { userId: user.id, commentId: commentId },
    });

    let updatedComment;

    if (existingRating) {
      // Update the upvotes/downvotes count if rating changes
      if (existingRating.ratingValue !== ratingValue) {
        updatedComment = await prisma.comment.update({
          where: { id: commentId },
          data: {
            upvotes: { increment: ratingValue === 1 ? 1 : -1 },
            downvotes: { increment: ratingValue === 0 ? 1 : -1 },
          },
        });

        await prisma.rating.update({
          where: { id: existingRating.id },
          data: { ratingValue },
        });
      }
    } else {
      // Create a new rating
      await prisma.rating.create({
        data: {
          ratingValue,
          userId: user.id,
          commentId: commentId,
        },
      });

      updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvotes: { increment: ratingValue === 1 ? 1 : 0 },
          downvotes: { increment: ratingValue === 0 ? 1 : 0 },
        },
      });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error rating comment:', error);
    res.status(500).json({ error: 'Failed to rate comment' });
  }
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const user = verifyToken(req, res);
    if (!user) return; // Unauthorized if no valid token
  
    const { postId } = req.body;
  
    try {
      // Step 1: Check if the post exists and belongs to the user
      const post = await prisma.blogPost.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      if (post.authorId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Step 2: Delete the post
      await prisma.blogPost.delete({
        where: { id: postId },
      });
  
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  }
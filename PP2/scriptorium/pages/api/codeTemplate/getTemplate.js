import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { id } = req.query;
  
    try {
      const template = await prisma.codeTemplate.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: { select: { firstName: true, lastName: true } }, // Optional: Include author details
        },
      });
  
      if (!template) {
        return res.status(404).json({ error: 'Code template not found' });
      }
  
      res.status(200).json(template);
    } catch (error) {
        console.error('Error fetching code template:', error);
        res.status(500).json({ error: 'Failed to fetch code template' });
    }
 }
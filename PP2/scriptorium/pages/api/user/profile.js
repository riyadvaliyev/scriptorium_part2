import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';


export default async function handler(req, res) {
    const user = verifyToken(req, res);
    if (user) {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { firstName: true, lastName: true, email: true, phoneNumber: true, avatar: true }
      });
      res.json(userData);
    }
}
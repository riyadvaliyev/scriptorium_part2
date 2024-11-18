import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  res.status(200).json({ message: 'Logout successful' });
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken';
import { avatarOptions } from '@/constants/avatars';


export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { firstName, lastName, email, password, phoneNumber, avatar} = req.body;
    
    // Check if the selected avatar is valid
    if (avatar && !avatarOptions.includes(avatar)) {
        return res.status(400).json({ error: 'Invalid avatar choice' });
    }
    const avatarPath = avatar ? `/avatars/${avatar}` : null; // Set path if avatar is provided, else null

    const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        const user = await prisma.user.create({
          data: { firstName, lastName, email, password: hashedPassword, phoneNumber, role: "USER", avatar: avatarPath }
        });
  
        const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
        // Send success response if user creation is successful
        return res.status(201).json({ accessToken, refreshToken });
      } catch (error) {
        // Log the error to identify its source
        console.error("Signup error:", error);
  
        // Check if the error is due to a unique constraint (like email already exists)
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          return res.status(400).json({ error: "Email already exists." });
        }
  
        // Return a generic error message for other types of errors
        return res.status(500).json({ error: "An error occurred. Please try again." });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
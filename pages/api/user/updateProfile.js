import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { verifyToken } from '@/utils/verifyToken';
const bcrypt = require('bcrypt');
import { avatarOptions } from '@/constants/avatars';

  
export default async function handler(req, res) {
    // Verify the user token
    const user = verifyToken(req, res);
    if (!user) return;
  
    const { firstName, lastName, email, phoneNumber, password, avatar } = req.body;
    const updateData = {};
  
    // Add fields to updateData only if they are provided
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (password) updateData.password = await bcrypt.hash(password, 10); // Hash the password if provided

    // Validate avatar choice if provided
    if (avatar) {
        if (!avatarOptions.includes(avatar)) {
            return res.status(400).json({ error: 'Invalid avatar choice' });
        }
        updateData.avatar = `/avatars/${avatar}`; // Store the avatar URL path
    }

    try {
      // Update user data in the database
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
}
  
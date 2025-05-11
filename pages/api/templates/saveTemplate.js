import prisma from '../../../utils/db';
import { verifyToken } from '../../../utils/verifyToken';

// THIS HAS BEEN TESTED.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Must be a POST request." });
    }

    /**
     * Assume: title: String, explanation: String, tags: String[], code: String, refreshToken: String
     */
    
    const accessToken = req.headers.authorization;
    const { title, explanation, tags, code, language } = req.body;

    const verified_token = verifyToken(req, res);

    if (!verified_token) {
        return res.status(401).json({ error: "Invalid token" });
    } else if (!title || !explanation || !tags || !code || !language) {
        return res.status(400).json({ error: "All fields title, explanation, tags, code, and language are required." });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: verified_token.id
        }
    });

    let loweredLanguage = language.toLowerCase();

    if (!user) {
        return res.status(401).json({ error: "User not found" });
    } else if (loweredLanguage !== "javascript" && loweredLanguage !== "python" 
        && loweredLanguage !== "java" && loweredLanguage !== "c++" && loweredLanguage !== "c") {
        return res.status(400).json({ error: "Invalid language" });
    }

    try {
        // const newTags = []
        console.log(tags);
        console.log("newTags");

        const newTags = await Promise.all(
            tags.map(async (tag) => {
              const existingTag = await prisma.tag.findUnique({
                where: { name: tag.name },
              });
              return existingTag
                ? { id: existingTag.id }
                : await prisma.tag.create({ data: { name: tag.name } });
            })
          );

          console.log("newTags2");
          console.log(newTags);
          
          // After ensuring newTags contains the correct IDs
          const template = await prisma.codeTemplate.create({
            data: {
              title,
              explanation,
              code,
              language: loweredLanguage,
              userId: user.id,
              tags: {
                connect: newTags.map(tag => ({ id: tag.id })),
              },
            },
          });

          console.log("template");
          
          // Check for success
          if (!template) {
            return res.status(500).json({ error: "Failed to save template" });
          }
        return res.status(201).json({ savedTemplate: template });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
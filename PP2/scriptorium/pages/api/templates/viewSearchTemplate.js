import prisma from '../../../utils/db';
import { verifyToken } from '../../../utils/verifyToken';


/*
As a user, I want to view and search through my list of my saved templates, 
including their titles, explanations, and tags, so that I can easily find and reuse them.
*/

// Tested

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Must be a GET request." });
    }

    const { title, explanation, tags, page, pageSize } = req.query;
    const verified_token = verifyToken(req, res);

    if (!verified_token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const intPage = parseInt(page) || 1;
    const intPageSize = parseInt(pageSize) || 10;
    const skip = (intPage - 1) * intPageSize;

    if (tags && !Array.isArray(tags)) {
        var tags_arr = [tags];
    } else if (tags) {
        var tags_arr = tags
    }

    try {
        // console.log(verified_token.id);
        const filter_settings = {
            userId: verified_token.id,
        }
        if (title) {
            filter_settings.title = {
                contains: title,
            }
        }
        if (explanation) {
            filter_settings.explanation = {
                contains: explanation,
            }
        }

        if (tags) {
            tags_arr = tags_arr.map(tag => tag.toLowerCase());
            filter_settings.tags = {
                some: {
                    OR: tags_arr.map(tag => ({
                        name: {
                            contains: tag,
                        },
                    })),
                },
            }
        }

        // Like searchTemplate.js, GPT helped with pagination here.
        const templates = await prisma.codeTemplate.findMany({
            where: filter_settings,
            skip: skip,
            take: intPageSize,
            orderBy: { id: 'desc' },  // descending
            include: {
                tags: true,
            }
        });

        const count = await prisma.codeTemplate.count();
        const totalPages = Math.ceil(count / intPageSize);
        const filteredCount = await prisma.codeTemplate.count(
            { 
                where: filter_settings
            }
        );
        const filteredTotalPageCount = Math.ceil(filteredCount / intPageSize);

        res.status(200).json({
            data: templates,
            meta: {
                currentPage: intPage,
                pageSize: intPageSize,
                totalPages: totalPages,
                filteredTotalPageCount: filteredTotalPageCount,
                filteredTotalCount: filteredCount,
                totalCount: count,
            }
          });
    } catch (error) {
        return res.status(401).json({ "error": error.message });
    }
}
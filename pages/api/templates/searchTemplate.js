import prisma from '../../../utils/db';

/*
As a visitor, I want to search through all available templates by title, 
tags, or content so that I can quickly find relevant code for my needs.
*/

// Tested.

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

    // ChatGPT helped with some of the pagination code (mostly the pagination bits, I did the rest)
    const { title, tempTags, content, page, pageSize} = req.query;
    const intPage = parseInt(page) || 1;
    const intPageSize = parseInt(pageSize) || 10;
    const skip = (intPage - 1) * intPageSize;

    if (tempTags && !Array.isArray(tempTags)) {
        var tags = [tempTags];
    }

    try {
        const filter_settings = {};

        if (title) {
            filter_settings.title = {
                contains: title,
            }
        }

        if (tags) {
            filter_settings.tags = {
                every: {
                    name: {
                        in: tags,
                    }
                }
            }
        }

        // this could mean explanations, but ill assume code for now 
        // since technically code is the content of the code template
        // also in what world is the "content" of a codetemplate the explanation? :skull:
        if (content) {
            filter_settings.code = {
                contains: content,
            }
        }

        const templates = await prisma.codeTemplate.findMany({
            where: filter_settings,
            skip: skip,
            take: intPageSize,
            orderBy: { id: 'desc'}
        });

        const count = await prisma.codeTemplate.count();
        const totalPages = Math.ceil(count / intPageSize);

        res.status(200).json({
            data: templates,
            meta: {
              currentPage: intPage,
              pageSize: intPageSize,
              totalPages: totalPages,
              totalCount: count,
            }
          });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
/*
    User story to satisfy: 
    "As the system administrator, I want to sort blog posts and comments based on the total number of reports 
    they received so that I can find the inappropriate content easier."

    Overall purpose of the file: Creates an GET endpoint that takes user info fron req.query.
    and sorts content.

    TODO: Massive implementation assumption (permitted based on Piazza post @192). Assuming that the sorted page displays
    the sorted blog posts seperate from the sorted comment entries. In other words, the system admin can only request for sorted blog posts OR
    sorted comments ONLY at 1 given time.

    Used ChatGPT as brainstorming inspiration and for helped to structure the code + error handling
*/
//Imports
import prisma from "../../../utils/db"; 
import {verifyToken} from "../../../utils/verifyToken";

//Handler 
export default async function handler(req, res) {
    // Checking if request type is correct
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not supported" });
    }

    // Authenticating user
    const isUser = verifyToken(req, res);
    if (!isUser) {
        return; // JSON response already handled under the case where we have a visitor trying to access
    }

    // Authenticating that we have an admin user
    if (isUser.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden: Only admins can access this." });
    }

    // Getting GET body content
    // For now, assume contentType can be: "BlogPost", "Comment". Not supporting the "Both" option as of now
    const { contentType } = req.query;
    let pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber, 10) : 1;
    let limitNumber = req.query.limitNumber ? parseInt(req.query.limitNumber, 10) : 10;

    // Validating req.query entry
    // Check if required fields are defined
    // Using the ? operator in case either variable are undefined
    // If content type after trimming is still undefined, we are missing info
    if (!contentType?.trim()) {
        return res.status(400).json({ error: "Missing required fields: contentType" });
    }

    // Checking if contentType is neither of the intended types
    if (contentType !== "BlogPost" && contentType !== "Comment") {
        return res.status(400).json({ error: "Invalid content type. Must be reporting either a BlogPost or Comment." });
    }

    // Initializing variables for pagination, with the values actually being assigned at a later point
    let totalBlogPosts, totalComments, totalNumberOfPages;

    if (contentType === "BlogPost") {
        // Defining the values of page and limit
        totalBlogPosts = await prisma.blogPost.count();
        totalNumberOfPages = Math.ceil(totalBlogPosts / limitNumber);
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        if (pageNumber > totalNumberOfPages) {
            pageNumber = totalNumberOfPages;
        }
    }

    if (contentType === "Comment") {
        // Defining the values of page and limit
        totalComments = await prisma.comment.count();
        totalNumberOfPages = Math.ceil(totalComments / limitNumber);
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        if (pageNumber > totalNumberOfPages) {
            pageNumber = totalNumberOfPages;
        }
    }

    // Try statement to retrieve all non-hidden blog posts AND all non-hidden comments
    try {
        // Defining common returned variable
        let retrievedContent = [];
        // Defining common search condition
        const contentSearchCondition = { hidden: false };

        // Fetching all non-hidden blog posts
        if (contentType === "BlogPost") {
            retrievedContent = await prisma.blogPost.findMany({
                where: contentSearchCondition,
                include: { // creates an additional nested object to store the number of reports a blog post garnered
                    _count: {
                        select: { reports: true }
                    }
                }
            });
        } 

        // Fetching all non-hidden comments
        if (contentType === "Comment") {
            retrievedContent = await prisma.comment.findMany({
                where: contentSearchCondition,
                include: { // creates an additional nested object to store the number of reports a comment garnered
                    _count: {
                        select: { reports: true }
                    }
                }
            });
        }

        // Flatten output JSON object (to make sorting entries easier)
        let formattedContent = retrievedContent.map(({ _count, ...restOfContent }) => ({
            ...restOfContent,
            reportCount: _count.reports
        }));

        // Sort the entries in descending order from having the most reports to having the least reports 
        formattedContent.sort((a, b) => (b.reportCount - a.reportCount));

        // Pagination logic: Calculate start and end indices
        const startIndex = (pageNumber - 1) * limitNumber;
        const paginatedContent = formattedContent.slice(startIndex, startIndex + limitNumber);

        return res.status(200).json(paginatedContent);
    } catch (error) {
        // Handle errors here
        return res.status(500).json({ message: error, error: "Failed to fetch or sort content" });
    }
}

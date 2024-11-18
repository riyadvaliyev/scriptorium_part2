/*
    User story to satisfy: 
    "As the system administrator, I want to hide a content that I deem inappropriate so that Scriptorium remains safe for everyone. 
    This content would then be hidden from everyone, except for the author. 
    The author can still see the content (with a flag that indicates the reports), but cannot edit it."

    Overall purpose of the file: Creates a POST endpoint that takes user info fron req.body and 
    makes a piece of content (either a report or a comment) hidden

    Citation:

    Used ChatGPT as brainstorming inspiration and for helped to structure the code + error handling
*/

// Imports 
import prisma from "../../../utils/db"; 
import {verifyToken} from "../../../utils/verifyToken";

// Handler
export default async function handler (req, res){

    // Checking if request type is correct
    if (req.method !== "POST"){
        return res.status(405).json({error: "Method not supported"});
    }

    //Authenticating user
    const isUser = verifyToken(req, res);
    if (!isUser){
         return; // JSON response already handled under the case where we have a visitor trying to access
    } 

    // Authenticating that we have an admin user
    if (isUser.role !== "ADMIN"){
        return res.status(403).json({ error: "Forbidden: Only admins can access this." }); 
    }

    // Getting POST body content
    const{contentType, blogPostId, commentId} = req.body;
    
    // Check if required fields are defined
    // Using the ? operator in case contentType is undefined
    if(!contentType?.trim()){
         return res.status(400).json({ error: "Missing required fields: contentType" });
    }
 
    // Check if contentType is neither of the accepted types 
    if (contentType !== "BlogPost" && contentType !== "Comment" ) {
         return res.status(400).json({ error: "Invalid content type. Must be reporting either a BlogPost or Comment." });
    }
 
    // Check for mismatch between contentType and the ids
    if (contentType === "BlogPost" && !blogPostId) {
         return res.status(400).json({ error: "Content type is Blog Post, but missing Blog Post Id" });
    } 
     
    if (contentType === "Comment" && !commentId) {
         return res.status(400).json({ error: "Content type is Comment, but missing Comment Id" });
    } 

    // Try block #1:
    // Validating whether blogPostId / commentId are valid
    try {
        if (contentType === "BlogPost"){
            const searchCondition = {id: blogPostId};
            const blogPostInstance = await prisma.blogPost.findUnique({
                where: searchCondition
            });
            if (!blogPostInstance){
                return res.status(404).json({ error: "Blog Post not found" });
            }
        } else if (contentType === "Comment"){
            const searchCondition = {id: commentId};
            const commentInstance = await prisma.comment.findUnique({
                where: searchCondition
            });
            if (!commentInstance){
                return res.status(404).json({ error: "Comment not found" });
            }
        }

    } catch (error) {
        // console.error("Error validating content ids:", error); // For debugging purposes
        return res.status(500).json({ error: "Failed to validate content ids" });
    }

    // Try block #2: Hiding the content
    try {
        let hiddenContent;
        if (contentType === "BlogPost"){
            hiddenContent = await prisma.blogPost.update({
                where: { id: blogPostId },
                data: { hidden: true },
            });
        } else if (contentType === "Comment"){
            hiddenContent = await prisma.comment.update({
                where: { id: commentId },
                data: { hidden: true },
            });
        }
        return res.status(200).json(hiddenContent);

    } catch (error){
        // console.error("Error hiding content:", error); // For debugging purposes
        return res.status(500).json({ error: "Failed to hide content" });
    }

}
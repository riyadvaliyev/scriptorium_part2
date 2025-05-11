// Middleware function to verify JWT
//import jwt from "jsonwebtoken";

// Function to verify user access
// Here, an individual is an user IF they have role "USER" or "ADMIN"
export function verifyUser(req, res){
    // Check if we have a valid individual
    const individual = verifyToken(req.headers.authorization);
  
    if (!individual) {
          return res.status(401).json({
          message: "Unauthorized",
          });
    }
    // Check if the individual has the 'ADMIN' role
    if (individual.role !== "USER") {
      return res.status(403).json({ error: "Forbidden: Only users and admins can access this." }); 
    }
    return true;
}

// Function to verify system admin access
export function verifyAdmin(req, res){
    // Check if we have a valid individual
    const individual = verifyToken(req.headers.authorization);
  
    if (!individual) {
          return res.status(401).json({
          message: "Unauthorized",
          });
    }
    // Check if the user has the 'ADMIN' role
    if (individual.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Only users and admins can access this." }); 
    }
    return true;
}
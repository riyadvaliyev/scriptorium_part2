import jwt from 'jsonwebtoken';

export function verifyToken(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    res.status(403).json({ error: "Token is not valid" });
    return null;
  }
}

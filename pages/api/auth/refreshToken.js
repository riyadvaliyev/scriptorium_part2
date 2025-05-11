import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { refreshToken } = req.body;

  // Check if refreshToken is provided
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is missing" });
  }

  // Verify refreshToken
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      // If token is invalid, return 403 Forbidden
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new access token if refresh token is valid
    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  });
}
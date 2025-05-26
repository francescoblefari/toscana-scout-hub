// Basic placeholder middleware for checking admin role
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>
    // Super simple check based on the placeholder token format: fake-token-for-userId-role
    if (token && token.endsWith('-admin')) {
      // In a real app, you'd verify a JWT and check the role from its payload
      req.user = { role: 'admin', id: token.split('-')[3] }; // Mock user object
      return next();
    }
  }
  res.status(403).json({ message: 'Forbidden: Admin access required.' });
};

module.exports = { isAdmin };

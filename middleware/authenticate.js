const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received Token:', token); // Log the token received from the frontend
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to the request object
      next();
    } catch (err) {
      console.error('Invalid token:', err.message);
      res.status(403).json({ error: 'Invalid token' });
    }
  };
  

module.exports = authenticate;


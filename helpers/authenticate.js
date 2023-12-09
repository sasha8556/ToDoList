const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
      if (token == null) res.status(401).send('Unauthorized');
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) next(new Error("invalid token"));
        req.user = user;
        next();
      });
    } catch (error) {
     return  res.status(403).send('Forbidden');
    }
  };


  module.exports = authenticateToken
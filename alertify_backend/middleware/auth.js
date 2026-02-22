const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 🔥 Split "Bearer token"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token format invalid" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = verified; // contains { id: ... }
    next();

  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
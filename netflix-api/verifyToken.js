const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header.token;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized: You are not authenticated" });
  }

  try {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    res.status(404).json("Token is not valid");
  }
};


module.exports = verifyToken;

const jwt = require("jsonwebtoken");
const prisma = require("../libs/prisma");
const { JWT_SECRET, JWT_EXPIRED_IN } = require("../config/config");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRED_IN });
};

const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = findById(decoded.id);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const findUserByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

const findUserByUsername= async (username) => {
  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });
  return user;
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  generateToken,
  authenticateJWT
};

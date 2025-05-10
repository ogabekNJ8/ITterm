const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../schemas/User");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const decodedData = jwt.verify(token, config.get("tokenKey"));

    const user = await User.findById(decodedData.id);
    if (!user || !user.is_active) {
      return res
        .status(403)
        .json({ message: "User not authorized or inactive" });
    }

    req.user = decodedData;
    next();
  } catch (error) {
    return res.status(403).json({ message: "User not authorized" });
  }
};

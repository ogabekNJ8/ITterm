const jwt = require("jsonwebtoken");
const config = require("config");
const Admin = require("../../schemas/Admin");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({ message: "Admin not authorized" });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "Admin not authorized" });
    }

    const decodedData = jwt.verify(token, config.get("tokenKey"));

    const admin = await Admin.findById(decodedData.id);
    if (!admin || !admin.is_active) {
      return res
        .status(403)
        .json({ message: "Admin not authorized or inactive" });
    }

    req.admin = decodedData;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Admin not authorized" });
  }
};

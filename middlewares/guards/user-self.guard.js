module.exports = function (req, res, next) {
  try {
    if (req.params.id !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only manage your own profile",
        });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "User access denied" });
  }
};

module.exports = function (req, res, next) {
  try {
    if (req.params.id !== req.admin.id && !req.admin.is_creator) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only manage your own profile",
        });
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "Admin access denied" });
  }
};

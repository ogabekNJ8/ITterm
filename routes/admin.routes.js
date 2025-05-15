const {
  addAdmin,
  loginAdmin,
  logoutAdmin,
  findAll,
  findById,
  update,
  remove,
} = require("../controllers/admin.controller");

const adminJwtGuard = require("../middlewares/guards/admin-jwt.guard");
const adminSelfGuard = require("../middlewares/guards/admin-self.guard");

const router = require("express").Router();

router.post("/", addAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/", adminJwtGuard, findAll);
router.get("/:id", adminJwtGuard, adminSelfGuard, findById);
router.patch("/:id", adminJwtGuard, adminSelfGuard, update);
router.delete("/:id", adminJwtGuard, adminSelfGuard, remove);

module.exports = router;

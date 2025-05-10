const {
  addUser,
  findAll,
  findById,
  update,
  remove,
  loginUser,
} = require("../controllers/user.controller");
const userJwtGuard = require("../middlewares/guards/user-jwt.guard");
const userSelfGuard = require("../middlewares/guards/user-self.guard");

const router = require("express").Router();

router.post("/", addUser);
router.post("/login", loginUser);
router.get("/", userJwtGuard, findAll);
router.get("/:id", userJwtGuard, userSelfGuard, findById);
router.patch("/:id", userJwtGuard, userSelfGuard, update);
router.delete("/:id", userJwtGuard, userSelfGuard, remove);

module.exports = router;

const {
  addAuthor,
  findAll,
  findById,
  update,
  remove,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
} = require("../controllers/author.controller");
const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");
const authorSelfGuard = require("../middlewares/guards/author-self.guard");

const router = require("express").Router();

router.post("/", addAuthor);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.get("/", authorJwtGuard, findAll);
router.get("/activate/:link", authorActivate);
router.get("/:id", authorJwtGuard, authorSelfGuard, findById); // ketma-ketlik muhim
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

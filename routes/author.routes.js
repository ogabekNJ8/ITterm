const {
  addAuthor,
  findAll,
  findById,
  update,
  remove,
  loginAuthor,
} = require("../controllers/author.controller");
const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");
const authorSelfGuard = require("../middlewares/guards/author-self.guard");

const router = require("express").Router();

router.post("/", addAuthor);
router.post("/login", loginAuthor);
router.get("/", authorJwtGuard, findAll);
router.get("/:id", authorJwtGuard, authorSelfGuard, findById); // ketma-ketlik muhim
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

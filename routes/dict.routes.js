const {
  addDict,
  findAll,
  findById,
  update,
  remove,
  findByLetter,
} = require("../controllers/dict.controller");
const authorExpertGuard = require("../middlewares/guards/author-expert.guard");
const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");

const router = require("express").Router();

router.post("/", authorJwtGuard, authorExpertGuard, addDict);
router.get("/", findAll);
router.get("/:id", findById);
router.get("/:letter", findByLetter);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

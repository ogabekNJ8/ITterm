const {
  addTag,
  findAll,
  findById,
  update,
  remove,
} = require("../controllers/tag.controller");

const router = require("express").Router();

router.post("/", addTag);
router.get("/", findAll);
router.get("/:id", findById);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

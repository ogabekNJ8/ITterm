const {
  addTopic,
  findAll,
  findById,
  update,
  remove,
} = require("../controllers/topic.controller");

const router = require("express").Router();

router.post("/", addTopic);
router.get("/", findAll);
router.get("/:id", findById);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

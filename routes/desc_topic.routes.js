const {
  addDescTopic,
  findAll,
  findById,
  update,
  remove,
} = require("../controllers/desc_topic.controller");

const router = require("express").Router();

router.post("/", addDescTopic);
router.get("/", findAll);
router.get("/:id", findById);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

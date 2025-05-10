const {
  addDescription,
  findAll,
  findById,
  findByCategoryId,
  update,
  remove,
} = require("../controllers/description.controller");

const router = require("express").Router();

router.post("/", addDescription);
router.get("/", findAll);
router.get("/:id", findById);
router.get("/category/:category_id", findByCategoryId);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

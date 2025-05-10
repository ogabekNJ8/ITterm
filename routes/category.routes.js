const {
  addCategory,
  findAll,
  findById,
  findChildCategories,
  update,
  remove,
} = require("../controllers/category.controller");

const router = require("express").Router();

router.post("/", addCategory);
router.get("/", findAll);
router.get("/:id", findById);
router.get("/children/:parent_id", findChildCategories);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

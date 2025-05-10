const {
  addSynonym,
  findAll,
  findById,
  findByDictId,
  findByDescId,
  update,
  remove,
} = require("../controllers/synonym.controller");

const router = require("express").Router();

router.post("/", addSynonym);
router.get("/", findAll);
router.get("/:id", findById);
router.get("/dict/:dict_id", findByDictId);
router.get("/desc/:desc_id", findByDescId);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;

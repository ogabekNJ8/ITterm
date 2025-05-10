const router = require("express").Router();

const dictRouter = require("./dict.routes");
const categoryRouter = require("./category.routes");
const socialRouter = require("./social.route");
const descriptionRouter = require("./description.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");
const tagRouter = require("./tag.routes");
const topicRouter = require("./topic.routes");
const desc_topicRouter = require("./desc_topic.routes");


router.use("/dict", dictRouter);
router.use("/category", categoryRouter);
router.use("/social", socialRouter);
router.use("/description", descriptionRouter);
router.use("/synonym", synonymRouter);
router.use("/author", authorRouter);
router.use("/tag", tagRouter);
router.use("/topic", topicRouter);
router.use("/desc_topic", desc_topicRouter);

module.exports = router;

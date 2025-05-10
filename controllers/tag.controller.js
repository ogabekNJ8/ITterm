const Tag = require("../schemas/Tag");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { tagValidation } = require("../validation/tag.validation");

const addTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }
    const newTag = await Tag(value);
    await newTag.save();
    res.status(201).send({ message: "New Tag added", newTag });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Tag.find();
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).send({ message: "Tag not found" });
    }
    res.status(200).send({ data: tag });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findByTopic = async (req, res) => {
  const { topicId } = req.params;
  try {
    const tags = await Tag.find({ topic_id: topicId });
    res.status(200).send({ data: tags });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const tags = await Tag.find({ category_id: categoryId });
    res.status(200).send({ data: tags });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }

    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedTag) {
      return res.status(404).send({ message: "Tag not found" });
    }

    res.status(200).send({ message: "Tag updated", data: updatedTag });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Tag.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: "Tag not found" });
    }
    res.status(200).send({ message: "Tag deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addTag,
  findAll,
  findById,
  findByTopic,
  findByCategory,
  update,
  remove,
};

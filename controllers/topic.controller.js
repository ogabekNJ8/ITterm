const Topic = require("../schemas/Topic");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { topicValidation } = require("../validation/topic.validation");

const addTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }
    const newTopic = await Topic(value);
    res.status(201).send({ message: "New Topic added", newTopic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Topic.find().populate(author_id);
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findById(id).populate(author_id);
    res.status(200).send({ data: topic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }

    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedTopic) {
      return res.status(404).send({ message: "Topic not found" });
    }

    res.status(200).send({ message: "Topic updated", data: updatedTopic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Topic.findByIdAndDelete(id);
    res.status(200).send({ message: "Topic deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addTopic,
  findAll,
  findById,
  update,
  remove,
};

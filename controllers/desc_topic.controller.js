const DescTopic = require("../schemas/DescTopic");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { descTopicValidation } = require("../validation/desc_topic.validation");

const addDescTopic = async (req, res) => {
  try {
    const { error, value } = descTopicValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }
    const newDescTopic = await DescTopic(value);
    res.status(201).send({ message: "New Desc_Topic added", newDescTopic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await DescTopic.find().populate(desc_id).populate(topic_id);
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await DescTopic.findById(id)
      .populate(desc_id)
      .populate(topic_id);
    res.status(200).send({ data: item });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = descTopicValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }

    const updatedItem = await DescTopic.findByIdAndUpdate(
      req.params.id,
      value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).send({ message: "Desc_Topic not found" });
    }

    res.status(200).send({ message: "Desc_Topic updated", data: updatedItem });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await DescTopic.findByIdAndDelete(id);
    res.status(200).send({ message: "Desc_Topic deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addDescTopic,
  findAll,
  findById,
  update,
  remove,
};

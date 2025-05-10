const Description = require("../schemas/Description");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { descriptionValidation } = require("../validation/description.validation");


const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const { category_id, description } = req.body;
    const newDescription = await Description.create({
      category_id,
      description,
    });
    res.status(201).send({ message: "New Description added", newDescription });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Description.find().populate("category_id");
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const description = await Description.findById(id).populate("category_id");
    res.status(200).send({ data: description });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findByCategoryId = async (req, res) => {
  const { category_id } = req.params;
  try {
    const descriptions = await Description.find({ category_id: category_id });
    res.status(200).send({ data: descriptions });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const updatedDescription = await Description.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res
      .status(200)
      .send({ message: "Description updated", data: updatedDescription });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Description.findByIdAndDelete(id);
    res.status(200).send({ message: "Description deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addDescription,
  findAll,
  findById,
  findByCategoryId,
  update,
  remove,
};

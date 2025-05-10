const Social = require("../schemas/Social");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { socialValidation } = require("../validation/social.validation");

const add = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }

    const { social_name, social_icon_file } = req.body;
    const newsocial = await Social.create({ social_name, social_icon_file });
    res.status(201).send({ message: "New social added", newsocial });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Social.find();
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const social = await Social.findById(id);
    res.status(200).send({ data: social });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const updatedSocial = await Social.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).send({ message: "Value updated", data: updatedSocial });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Social.findByIdAndDelete(id);
    res.status(200).send({ message: "Social deleted succesfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  add,
  findAll,
  findById,
  update,
  remove,
};

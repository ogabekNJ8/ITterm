const Synonym = require("../schemas/Synonym");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { synonymValidation } = require("../validation/synonym.validation");

const addSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }

    const { desc_id, dict_id } = req.body;
    const newSynonym = await Synonym.create({ desc_id, dict_id });
    res.status(201).send({ message: "New Synonym added", newSynonym });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Synonym.find().populate("desc_id").populate("dict_id");
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const synonym = await Synonym.findById(id)
      .populate("desc_id")
      .populate("dict_id");
    res.status(200).send({ data: synonym });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findByDictId = async (req, res) => {
  const { dict_id } = req.params;
  try {
    const synonyms = await Synonym.find({ dict_id: dict_id }).populate(
      "desc_id"
    );
    res.status(200).send({ data: synonyms });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findByDescId = async (req, res) => {
  const { desc_id } = req.params;
  try {
    const synonyms = await Synonym.find({ desc_id: desc_id }).populate(
      "dict_id"
    );
    res.status(200).send({ data: synonyms });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const updatedSynonym = await Synonym.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).send({ message: "Synonym updated", data: updatedSynonym });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Synonym.findByIdAndDelete(id);
    res.status(200).send({ message: "Synonym deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addSynonym,
  findAll,
  findById,
  findByDictId,
  findByDescId,
  update,
  remove,
};

const Dict = require("../schemas/Dict");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { dictValidation } = require("../validation/dict.validation");

const addDict = async (req, res) => {
  try {
    const { error, value } = dictValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }

    const { term } = value;
    const newDict = await Dict.create({ term, letter: term[0] });
    res.status(201).send({ message: "New Term added", newDict });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Dict.find();
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const dic = await Dict.findById(id);
    res.status(200).send({ data: dic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findByLetter = async (req, res) => {
  const { letter } = req.params;
  try {
    const dic = await Dict.find({ letter: letter });
    res.status(200).send({ data: dic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = dictValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const updatedDic = await Dict.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send({ message: "Value updated", data: updatedDic });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Dict.findByIdAndDelete(id);
    res.status(200).send({ message: "Dic deleted succesfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addDict,
  findAll,
  findById,
  update,
  remove,
  findByLetter,
};

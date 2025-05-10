const Category = require("../schemas/Category");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { categoryValidation } = require("../validation/category.validation");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const { category_name, parent_category_id } = req.body;
    const newCategory = await Category.create({
      category_name,
      parent_category_id,
    });
    res.status(201).send({ message: "New Category added", newCategory });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Category.find().populate("parent_category_id");
    res.status(200).send({ data: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate("parent_category_id");
    res.status(200).send({ data: category });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findChildCategories = async (req, res) => {
  const { parent_id } = req.params;
  try {
    const categories = await Category.find({ parent_category_id: parent_id });
    res.status(200).send({ data: categories });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return sendErrorresponse(error, res);
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res
      .status(200)
      .send({ message: "Category updated", data: updatedCategory });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addCategory,
  findAll,
  findById,
  findChildCategories,
  update,
  remove,
};

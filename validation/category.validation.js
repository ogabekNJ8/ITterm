const Joi = require("joi");

exports.categoryValidation = (body) => {
  const schema = Joi.object({
    category_name: Joi.string()
      .min(2)
      .message("Category name too short")
      .max(50)
      .message("Category name too long")
      .required(),
    parent_category_id: Joi.string().allow(null, ""),
  });

  return schema.validate(body, { abortEarly: false });
};

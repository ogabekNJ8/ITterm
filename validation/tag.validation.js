const Joi = require("joi");

exports.tagValidation = (body) => {
  const schema = Joi.object({
    topic_id: Joi.string().required().messages({
      "any.required": "Topic ID majburiy",
      "string.base": "Topic ID satr bo'lishi kerak",
    }),
    category_id: Joi.string().required().messages({
      "any.required": "Category ID majburiy",
      "string.base": "Category ID satr bo'lishi kerak",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

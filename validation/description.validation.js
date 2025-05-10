const Joi = require("joi");

exports.descriptionValidation = (body) => {
  const schema = Joi.object({
    category_id: Joi.string().length(24).required().messages({
      "string.length":
        "category_id noto‘g‘ri formatda (ObjectId bo'lishi kerak)",
      "any.required": "category_id kiritilishi shart",
    }),
    description: Joi.string().min(5).required().messages({
      "string.min": "description 5 ta belgidan kam bo'lmasligi kerak",
      "string.empty": "description bo‘sh bo‘lmasligi kerak",
      "any.required": "description kiritilishi shart",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

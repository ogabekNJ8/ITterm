const Joi = require("joi");

exports.synonymValidation = (body) => {
  const schema = Joi.object({
    desc_id: Joi.string().length(24).required().messages({
      "string.length":
        "desc_id 24 belgidan iborat bo'lishi kerak (ObjectId formatida)",
      "string.empty": "desc_id bo'sh bo'lishi mumkin emas",
      "any.required": "desc_id kiritilishi shart",
    }),
    dict_id: Joi.string().length(24).required().messages({
      "string.length":
        "dict_id 24 belgidan iborat bo'lishi kerak (ObjectId formatida)",
      "string.empty": "dict_id bo'sh bo'lishi mumkin emas",
      "any.required": "dict_id kiritilishi shart",
    }),
  });

  return schema.validate(body, { abortEarly: false });
};

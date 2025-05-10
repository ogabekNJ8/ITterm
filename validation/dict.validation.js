const Joi = require("joi")

exports.dictValidation = (body) => {
  const schema = Joi.object({
    term: Joi.string()
      .min(2)
      .message(" IT Termin 1 harfdan kam bo'lmasligi kerak")
      .required()
      .messages({
        "string.empty": "Bo'sh bo'lishi mumkin emas",
        "any.required": "Lug'at albatta kiritilishi kerak", // body bo'sh bo'lsa
      }),
  });
  return schema.validate(body, {abortEarly: false})
}
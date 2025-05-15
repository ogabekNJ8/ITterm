const Joi = require("joi");

const adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    phone: Joi.string().trim().optional(),
    password: Joi.string().min(6).required(),
    is_active: Joi.boolean().optional(),
    is_creator: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

module.exports = { adminValidation };

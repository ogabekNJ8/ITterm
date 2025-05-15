const Joi = require("joi");

const userValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(6).required(),
    info: Joi.string().trim().optional(),
    photo: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

module.exports = { userValidation };

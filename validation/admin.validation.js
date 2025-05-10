const Joi = require("joi");

exports.adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(5).max(20),
    password: Joi.string().min(6).max(30).required(),
    is_active: Joi.boolean(),
    is_creator: Joi.boolean(),
  });

  return schema.validate(data);
};

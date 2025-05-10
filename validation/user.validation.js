const Joi = require("joi");

exports.userValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    info: Joi.string(),
    photo: Joi.string(),
    is_active: Joi.boolean(),
  });

  return schema.validate(data);
};

const Joi = require("joi");

exports.socialValidation = (body) => {
  const schema = Joi.object({
    social_name: Joi.string()
      .min(2)
      .message("Social name too short")
      .max(30)
      .message("Social name too long")
      .required(),
    social_icon_file: Joi.string().default("/social/default-icon.png"),
  });

  return schema.validate(body, { abortEarly: false });
};

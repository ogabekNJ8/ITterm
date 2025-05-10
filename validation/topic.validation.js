const Joi = require("joi");

exports.topicValidation = (body) => {
  const schema = Joi.object({
    author_id: Joi.string().required(),
    topic_title: Joi.string().min(3).max(100).required(),
    topic_text: Joi.string().min(10).required(),
    created_date: Joi.date().default(new Date()),
    updated_date: Joi.date().default(new Date()),
    is_checked: Joi.boolean().default(false),
    is_approved: Joi.boolean().default(false),
    expert_id: Joi.string().optional(),
  });

  return schema.validate(body, { abortEarly: false });
};

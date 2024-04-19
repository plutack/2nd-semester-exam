import Joi from "joi";

export const postValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().required(),
  author: Joi.string().required(),
  state: Joi.string().valid("draft", "published").default("draft").required(),
  readCount: Joi.number().integer().required(),
  readingTime: Joi.number().integer().required(),
});

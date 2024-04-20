import Joi from "joi";

export const postValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  body: Joi.string().required(),
  // author: Joi.string().optional(),
  // state: Joi.string().valid("draft", "published").default("draft").optional(),
  // readCount: Joi.number().integer().optional(),
  // readingTime: Joi.number().integer().optional(),
});

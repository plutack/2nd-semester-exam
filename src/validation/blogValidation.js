import Joi from "joi";

export const blogValidationSchema = Joi.object({
  title: Joi.string().not("").required(),
  description: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  body: Joi.string().not("").required()
});

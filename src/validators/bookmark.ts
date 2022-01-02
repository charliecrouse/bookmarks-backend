import Joi from 'joi';

export const bookmarkCreationSchema = Joi.object({
  name: Joi.string().min(1).max(128).required(),
  url: Joi.string().uri(),
  parentId: Joi.number(),
  ownerEmail: Joi.string().required(),
}).unknown(true);

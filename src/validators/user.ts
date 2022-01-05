import Joi from 'joi';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '@utils/crypto';

export const userCreationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required(),
}).unknown(true);

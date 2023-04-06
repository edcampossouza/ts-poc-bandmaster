import joi from "joi";
import joiDate from "@joi/date";
const Joi = joi.extend(joiDate);

export const MusicianInputSchema = Joi.object({
  name: Joi.string().required(),
  dateOfBirth: Joi.date().format("YYYY-MM-DD").required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  skills: Joi.array().items(Joi.string()).min(1).required(),
});

export const SigninSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

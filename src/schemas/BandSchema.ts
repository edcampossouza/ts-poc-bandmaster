import Joi from "joi";

export const BandSchema = Joi.object({
  name: Joi.string().required(),
  dateOfFoundation: Joi.date().required(),
  city: Joi.string().required(),
  style: Joi.string().required(),
});

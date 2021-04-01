import Joi, { string } from "joi";

const schema = Joi.object({
  SCORE: Joi.number().required(),
  NOTES: Joi.string(),
});
export default schema;

import joi from "joi";

const cardSchema = joi.object({
  amount: joi.number().min(1).required(),
});

export default cardSchema;

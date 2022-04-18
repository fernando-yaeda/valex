import joi from "joi";
const passwordRegex = /^[0-9]{4}$/;

const purchaseSchema = joi.object({
  password: joi.string().pattern(passwordRegex).required(),
  businessId: joi.number().required(),
  amount: joi.number().min(1).required(),
});

export default purchaseSchema;
import joi from "joi";

const passwordRegex = /^[0-9]{4}$/;
const securityCodeRegex = /^[0-9]{3}$/;

const activateCardSchema = joi.object({
  secutiryCode: joi.string().pattern(securityCodeRegex).required(),
  password: joi.string().pattern(passwordRegex).required()
});

export default activateCardSchema;

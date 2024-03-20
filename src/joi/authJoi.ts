import Joi from "joi";
import validator from "email-validator";

interface authInterface {
  name: string;
  email: string;
  password: string;
}

const schemaAuth = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  // .validate((email: string) => validator.validate(email)),
  password: Joi.string().required(),
});

export const validateAuth = (authData: authInterface) => {
  return schemaAuth.validate(authData);
};

import Joi from "joi";

interface authInterface {
  name: string;
  email: string;
  password: string;
}

const schemaAuth = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const validateAuth = (authData: authInterface) => {
  return schemaAuth.validate(authData);
};

import Joi from "joi";

// Register Body
interface registerInterface {
  name: string;
  email: string;
  password: string;
}

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const validateRegister = (authData: registerInterface) => {
  return registerSchema.validate(authData);
};

// Login Body
interface loginInterface {
  email: string;
  password: string;
}

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const validateLogin = (authData: loginInterface) => {
  return loginSchema.validate(authData);
};

// ResendVerification Body
interface resendVerificationInterface {
  email: string;
}

const resendVerificationScheme = Joi.object({
  email: Joi.string().required().email(),
});

export const validateResendEmail = (authData: resendVerificationInterface) => {
  return resendVerificationScheme.validate(authData);
};

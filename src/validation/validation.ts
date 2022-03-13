import Joi from 'joi';



export const validateUserSignUp = Joi.object({
    email: Joi.string().email().trim(),
    password: Joi.string()
      .required()
      .min(10)
      .max(20)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    fullname: Joi.string().required().trim().min(1).max(50),
  });
  
  export const validateUserLogin = Joi.object({
    email: Joi.string().email().trim(),
    password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  password: Joi.string().min(6).optional(),
  dob: Joi.date().less('now').optional(),
  email: Joi.forbidden(), // Prevent email updates
});

module.exports = { createUserSchema,updateUserSchema };
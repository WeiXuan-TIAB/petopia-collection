const Joi = require('joi');

const pet_profilesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  name: Joi.string().max(32).trim().required(),
  species: Joi.number().integer().positive().required(),
  breed: Joi.string().max(64).trim().required(),
  gender: Joi.string().valid('male', 'female', 'unknown').required(),
  birthday: Joi.date().iso().allow(null),
  weight_kg: Joi.number().positive().precision(2).required(),
  is_neutered: Joi.boolean().allow(null).default('false'),
  avatar_url: Joi.string().max(255).trim().allow(null),
  vaccinated_at: Joi.date().iso().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  @@index([member_id],: Joi.any().required(),
  @@index([species],: Joi.any().required()
}).options({
  stripUnknown: true,
  abortEarly: false
}).messages({
  'string.empty': '{#label}不能為空',
  'string.min': '{#label}至少需要{#limit}個字符',
  'string.max': '{#label}不能超過{#limit}個字符',
  'any.required': '{#label}為必填項目',
  'number.positive': '{#label}必須大於0',
  'string.email': '請輸入有效的電子郵件地址'
});

module.exports = { pet_profilesSchema };

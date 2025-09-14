const Joi = require('joi');

const adoption_agenciesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  name: Joi.string().max(100).trim().required(),
  address: Joi.string().max(255).trim().allow(null),
  email: Joi.string().max(100).trim().allow(null),
  phone: Joi.string().max(50).trim().allow(null),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  deleted_at: Joi.date().iso().allow(null)
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

module.exports = { adoption_agenciesSchema };

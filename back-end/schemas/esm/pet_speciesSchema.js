import Joi from 'joi';

export const pet_speciesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  code: Joi.string().max(32).trim().required(),
  name: Joi.string().max(32).trim().required(),
  icon_url: Joi.string().max(255).trim().required(),
  description: Joi.string().max(1000).allow('').allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now(')
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

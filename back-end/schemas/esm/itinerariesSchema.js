import Joi from 'joi';

export const itinerariesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  title: Joi.string().max(255).trim().required(),
  description: Joi.string().max(1000).allow('').allow(null),
  days: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().allow(null).default('now('),
  original_price: Joi.number().positive().precision(2).required(),
  currency: Joi.string().max(10).trim().required(),
  discount_price: Joi.number().positive().precision(2).allow(null),
  photo: Joi.string().max(255).trim().allow(null)
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

import Joi from 'joi';

export const promotionsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  promo_name: Joi.string().max(100).trim().allow(null),
  promo_type: Joi.string().valid('count', 'combo', 'itemType', 'amount', 'freeShipping').allow(null),
  promo_status: Joi.string().valid('pending', 'active', 'ended').allow(null).default('pending'),
  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().required(),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now(')
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

import Joi from 'joi';

export const promotion_productsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  promo_id: Joi.number().integer().positive().allow(null),
  product_id: Joi.number().integer().positive().allow(null),
  cat_code: Joi.string().min(2).max(100).trim().allow(null),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  @@index([cat_code],: Joi.any().required(),
  @@index([product_id],: Joi.any().required(),
  @@index([promo_id],: Joi.any().required()
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

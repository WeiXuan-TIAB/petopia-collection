import Joi from 'joi';

export const productsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  product_code: Joi.string().max(20).trim().required(),
  product_name: Joi.string().max(255).trim().required(),
  cat_code: Joi.string().min(2).max(100).trim().allow(null),
  product_desc: Joi.string().min(2).max(100).trim().required(),
  price: Joi.number().integer().positive().required(),
  cost: Joi.number().integer().positive().required(),
  is_active: Joi.boolean().required().default('false'),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  @@index([cat_code],: Joi.any().required()
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

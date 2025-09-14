const Joi = require('joi');

const ordersSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  customer_id: Joi.number().integer().positive().allow(null),
  order_num: Joi.string().max(20).trim().allow(null),
  order_status: Joi.string().valid('pending', 'stocking', 'shipped', 'arrived', 'canceled', 'returned').allow(null).default('pending'),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  @@index([customer_id],: Joi.any().required()
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

module.exports = { ordersSchema };

const Joi = require('joi');

const restaurant_closuresSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  restaurant_id: Joi.number().integer().positive().required(),
  date: Joi.date().iso().required(),
  start_time: Joi.date().iso().allow(null).default('dbgenerated('00:00:00''),
  end_time: Joi.date().iso().allow(null).default('dbgenerated('23:59:59''),
  closure_note: Joi.string().min(2).max(100).trim().allow(null),
  created_by: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_by: Joi.number().integer().positive().required(),
  updated_at: Joi.date().iso().allow(null).default('now('),
  @@unique([restaurant_id,: Joi.any().required(),
  @@index([created_by],: Joi.any().required(),
  @@index([updated_by],: Joi.any().required()
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

module.exports = { restaurant_closuresSchema };

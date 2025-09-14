const Joi = require('joi');

const restaurant_business_hoursSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  restaurant_id: Joi.number().integer().positive().required(),
  weekday: Joi.number().integer().positive().allow(null),
  start_time: Joi.date().iso().allow(null),
  end_time: Joi.date().iso().allow(null),
  note: Joi.string().max(255).trim().allow(null),
  is_closed: Joi.boolean().allow(null).default('true'),
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

module.exports = { restaurant_business_hoursSchema };

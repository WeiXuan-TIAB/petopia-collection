const Joi = require('joi');

const restaurant_seat_rulesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  seat_id: Joi.number().integer().positive().required(),
  species_id: Joi.number().integer().positive().required(),
  max_weight_kg: Joi.number().positive().precision(2).allow(null),
  note: Joi.string().min(2).max(100).trim().allow(null),
  created_by: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_by: Joi.number().integer().positive().required(),
  updated_at: Joi.date().iso().allow(null).default('now('),
  @@index([created_by],: Joi.any().required(),
  @@index([seat_id],: Joi.any().required(),
  @@index([species_id],: Joi.any().required(),
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

module.exports = { restaurant_seat_rulesSchema };

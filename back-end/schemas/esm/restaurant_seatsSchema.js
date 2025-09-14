import Joi from 'joi';

export const restaurant_seatsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  restaurant_id: Joi.number().integer().positive().required(),
  code: Joi.string().max(16).trim().required(),
  area: Joi.string().max(32).trim().required(),
  seats: Joi.number().integer().positive().required(),
  pet_allowed: Joi.boolean().allow(null).default('false'),
  status: Joi.string().valid('available', 'occupied', 'unavailable').allow(null).default('available'),
  note: Joi.string().min(2).max(100).trim().allow(null),
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

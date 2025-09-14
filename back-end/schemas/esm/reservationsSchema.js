import Joi from 'joi';

export const reservationsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  reservation_date: Joi.date().iso().required(),
  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().allow(null),
  party_size: Joi.number().integer().positive().required(),
  has_pet: Joi.boolean().allow(null).default('false'),
  status: Joi.string().valid('pending', 'confirmed', 'arrived', 'cancelled', 'no_show', 'completed').required().default('pending'),
  contact_phone: Joi.string().max(16).trim().allow(null),
  expire_at: Joi.date().iso().allow(null),
  created_by: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_by: Joi.number().integer().positive().required(),
  updated_at: Joi.date().iso().allow(null).default('now('),
  @@index([created_by],: Joi.any().required(),
  @@index([member_id],: Joi.any().required(),
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

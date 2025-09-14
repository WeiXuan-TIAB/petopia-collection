import Joi from 'joi';

export const place_reportsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  type_id: Joi.number().integer().positive().required(),
  description: Joi.string().max(1000).allow('').allow(null),
  area_type_id: Joi.number().integer().positive().required(),
  reported_by: Joi.number().integer().positive().required(),
  reported_at: Joi.date().iso().allow(null).default('now('),
  reported_status: Joi.string().valid('pending', 'approved', 'rejected').required().default('pending'),
  reported_resolution_notes: Joi.string().min(2).max(100).trim().allow(null),
  reported_area_data: Joi.any().allow(null),
  @@index([area_type_id],: Joi.any().required(),
  @@index([reported_by],: Joi.any().required(),
  @@index([type_id],: Joi.any().required()
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

import Joi from 'joi';

export const placesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  name: Joi.string().max(255).trim().required(),
  location_type_id: Joi.number().integer().positive().required(),
  geometry_type: Joi.string().max(50).trim().allow(null),
  point_coords: Joi.string().max(255).trim().allow(null),
  circle_center: Joi.string().max(255).trim().allow(null),
  circle_radius: Joi.number().positive().precision(2).allow(null),
  polygon_coords: Joi.string().min(2).max(100).trim().allow(null),
  address: Joi.string().max(255).trim().allow(null),
  phone_number: Joi.string().max(20).trim().allow(null),
  website: Joi.string().max(255).trim().allow(null),
  opening_hours: Joi.string().min(2).max(100).trim().allow(null),
  description: Joi.string().max(1000).allow('').allow(null),
  created_by: Joi.number().integer().positive().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now('),
  @@index([created_by],: Joi.any().required(),
  @@index([location_type_id],: Joi.any().required()
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

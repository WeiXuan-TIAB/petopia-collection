const Joi = require('joi');

const restaurantsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  email: Joi.string().max(254).trim().required(),
  tax_id: Joi.string().min(2).max(100).trim().required(),
  name: Joi.string().max(32).trim().required(),
  phone: Joi.string().max(20).trim().required(),
  zipcode: Joi.number().integer().positive().required(),
  city: Joi.string().max(16).trim().required(),
  area: Joi.string().max(16).trim().required(),
  street: Joi.string().max(255).trim().required(),
  latitude: Joi.number().positive().precision(2).required(),
  longitude: Joi.number().positive().precision(2).required(),
  contact_name: Joi.string().max(32).trim().required(),
  contact_phone: Joi.string().max(16).trim().required(),
  status: Joi.string().valid('active', 'suspended').required().default('active'),
  description: Joi.string().max(1000).allow('').required(),
  image_url: Joi.string().max(255).trim().required(),
  created_by: Joi.number().integer().positive().required(),
  updated_by: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now('),
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

module.exports = { restaurantsSchema };

import Joi from 'joi';

export const adoption_petsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  agency_id: Joi.number().integer().positive().required(),
  name: Joi.string().max(50).trim().required(),
  species: Joi.string().max(50).trim().allow(null),
  breed: Joi.string().max(50).trim().allow(null),
  age: Joi.number().integer().positive().allow(null),
  sex: Joi.string().valid('M', 'F', 'U').required().default('U'),
  description: Joi.string().max(1000).allow('').allow(null),
  status: Joi.string().valid('available', 'pending', 'adopted').required().default('available'),
  condition_text: Joi.string().min(2).max(100).trim().allow(null),
  valid_until: Joi.date().iso().allow(null),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  deleted_at: Joi.date().iso().allow(null),
  adoption_agencies: Joi.any().required(),
  @@index([agency_id],: Joi.any().required()
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

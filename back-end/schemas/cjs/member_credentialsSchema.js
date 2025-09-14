const Joi = require('joi');

const member_credentialsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  type: Joi.string().max(20).trim().allow(null).default('password'),
  provider: Joi.string().max(20).trim().allow(null),
  oauth_uid: Joi.string().max(255).trim().allow(null),
  credential_hash: Joi.string().max(255).trim().required(),
  expires_at: Joi.date().iso().allow(null),
  is_force_reset: Joi.boolean().allow(null).default('false'),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now('),
  @@unique([member_id,: Joi.any().required()
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

module.exports = { member_credentialsSchema };

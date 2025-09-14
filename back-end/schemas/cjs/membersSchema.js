const Joi = require('joi');

const membersSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  name: Joi.string().max(32).trim().allow(null),
  nickname: Joi.string().max(16).trim().allow(null),
  gender: Joi.string().valid('male', 'female', 'other').allow(null),
  email: Joi.string().max(255).trim().required(),
  birthday: Joi.date().iso().allow(null),
  mobile: Joi.string().max(16).trim().allow(null),
  status: Joi.string().valid('pending', 'active', 'suspended').required().default('pending'),
  avatar: Joi.string().max(255).trim().allow(null),
  last_login: Joi.date().iso().allow(null),
  latitude: Joi.number().positive().precision(2).allow(null),
  longitude: Joi.number().positive().precision(2).allow(null),
  is_online: Joi.boolean().allow(null).default('false'),
  location_visibility: Joi.boolean().allow(null).default('false'),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now(')
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

module.exports = { membersSchema };

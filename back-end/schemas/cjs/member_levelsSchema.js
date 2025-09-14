const Joi = require('joi');

const member_levelsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  code: Joi.string().max(16).trim().allow(null).default('starter'),
  name: Joi.string().max(32).trim().allow(null).default('新手鏟屎官'),
  min_points: Joi.number().integer().positive().required(),
  discount_rate: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(1000).allow('').required(),
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

module.exports = { member_levelsSchema };

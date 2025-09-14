const Joi = require('joi');

const forum_contentsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('blog', 'vlog').required(),
  title: Joi.string().max(200).trim().required(),
  content: Joi.string().min(2).max(100).trim().allow(null),
  status: Joi.string().valid('draft', 'published', 'archived').required().default('draft'),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  deleted_at: Joi.date().iso().allow(null),
  members: Joi.any().required(),
  @@index([member_id],: Joi.any().required()
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

module.exports = { forum_contentsSchema };

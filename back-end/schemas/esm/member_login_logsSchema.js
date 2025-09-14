import Joi from 'joi';

export const member_login_logsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  type: Joi.string().max(20).trim().required(),
  provider: Joi.string().max(20).trim().allow(null),
  status: Joi.string().max(20).trim().required(),
  ip_address: Joi.string().max(45).trim().required(),
  user_agent: Joi.string().min(2).max(100).trim().required(),
  error_msg: Joi.string().min(2).max(100).trim().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
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

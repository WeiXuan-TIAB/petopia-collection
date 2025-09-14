import Joi from 'joi';

export const member_point_logsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  ref_type: Joi.string().valid('purchase', 'refund', 'adjust', 'redeem').required(),
  ref_id: Joi.number().integer().positive().allow(null),
  points_before: Joi.number().integer().positive().allow(null).default(0),
  points_change: Joi.number().integer().positive().required(),
  description: Joi.string().max(1000).allow('').allow(null),
  created_by: Joi.number().integer().positive().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  @@index([created_by],: Joi.any().required(),
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

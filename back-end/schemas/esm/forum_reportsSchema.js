import Joi from 'joi';

export const forum_reportsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  target_type: Joi.string().valid('comment', 'content').required(),
  target_id: Joi.number().integer().positive().required(),
  reason: Joi.string().min(2).max(100).trim().required(),
  status: Joi.string().valid('pending', 'reviewed', 'dismissed', 'action_taken').required().default('pending'),
  created_at: Joi.date().iso().required().default('now('),
  reviewed_at: Joi.date().iso().allow(null),
  handled_by: Joi.number().integer().positive().allow(null),
  @@index([handled_by],: Joi.any().required(),
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

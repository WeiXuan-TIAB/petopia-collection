import Joi from 'joi';

export const reservation_status_logsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  reservation_id: Joi.number().integer().positive().required(),
  from_status: Joi.string().valid('pending', 'confirmed', 'arrived', 'cancelled', 'no_show', 'completed').required(),
  to_status: Joi.string().valid('pending', 'confirmed', 'arrived', 'cancelled', 'no_show', 'completed').required(),
  changed_by: Joi.number().integer().positive().allow(null),
  changed_by_type: Joi.string().valid('member', 'admin', 'system').required(),
  reason: Joi.string().min(2).max(100).trim().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  @@index([reservation_id],: Joi.any().required()
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

const Joi = require('joi');

const reservation_remindersSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  reservation_id: Joi.number().integer().positive().required(),
  reminder_type: Joi.string().valid('email', 'sms', 'app_push', 'line_bot').required(),
  reminder_time: Joi.date().iso().required(),
  sent_at: Joi.date().iso().allow(null),
  status: Joi.string().valid('pending', 'sent', 'failed').required(),
  error_message: Joi.string().min(2).max(100).trim().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now('),
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

module.exports = { reservation_remindersSchema };

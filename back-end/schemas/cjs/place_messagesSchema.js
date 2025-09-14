const Joi = require('joi');

const place_messagesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  sender_id: Joi.number().integer().positive().required(),
  receiver_id: Joi.number().integer().positive().required(),
  content: Joi.string().min(2).max(100).trim().required(),
  sent_at: Joi.date().iso().allow(null).default('now('),
  is_read: Joi.boolean().allow(null).default('false'),
  @@index([receiver_id],: Joi.any().required(),
  @@index([sender_id],: Joi.any().required()
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

module.exports = { place_messagesSchema };

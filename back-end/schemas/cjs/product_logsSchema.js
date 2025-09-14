const Joi = require('joi');

const product_logsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  product_id: Joi.number().integer().positive().allow(null),
  log_action: Joi.string().valid('create', 'update', 'delete', 'send').required(),
  changed_by: Joi.number().integer().positive().allow(null),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  @@index([changed_by],: Joi.any().required(),
  @@index([product_id],: Joi.any().required()
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

module.exports = { product_logsSchema };

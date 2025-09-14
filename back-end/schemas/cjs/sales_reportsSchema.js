const Joi = require('joi');

const sales_reportsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  report_type: Joi.string().valid('weekly', 'monthly', 'yearly').allow(null).default('monthly'),
  report_startdate: Joi.date().iso().required(),
  report_enddate: Joi.date().iso().required(),
  generated_at: Joi.date().iso().required(),
  generated_by: Joi.number().integer().positive().required(),
  @@index([generated_by],: Joi.any().required()
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

module.exports = { sales_reportsSchema };

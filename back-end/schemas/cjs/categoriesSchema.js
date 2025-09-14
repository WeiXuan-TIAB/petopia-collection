const Joi = require('joi');

const categoriesSchema = Joi.object({
  cat_code: Joi.string().min(2).max(100).trim().required(),
  cat_name: Joi.string().max(50).trim().required(),
  cat_desc: Joi.string().min(2).max(100).trim().required(),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now(')
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

module.exports = { categoriesSchema };

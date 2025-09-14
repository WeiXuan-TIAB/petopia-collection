const Joi = require('joi');

const product_colorsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  color_name: Joi.string().max(50).trim().required(),
  hex_code: Joi.string().max(7).trim().required()
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

module.exports = { product_colorsSchema };

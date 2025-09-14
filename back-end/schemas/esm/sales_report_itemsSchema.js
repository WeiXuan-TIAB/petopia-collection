import Joi from 'joi';

export const sales_report_itemsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  report_id: Joi.number().integer().positive().allow(null),
  product_id: Joi.number().integer().positive().allow(null),
  var_id: Joi.number().integer().positive().allow(null),
  sales_qty: Joi.number().integer().positive().required().default(0),
  sales_amount: Joi.number().integer().positive().required().default(0),
  @@index([product_id],: Joi.any().required(),
  @@index([report_id],: Joi.any().required(),
  @@index([var_id],: Joi.any().required()
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

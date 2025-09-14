import Joi from 'joi';

export const return_itemsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  customer_id: Joi.number().integer().positive().allow(null),
  return_order: Joi.number().integer().positive().allow(null),
  return_id: Joi.number().integer().positive().allow(null),
  item_condition: Joi.string().valid('normal', 'scrap').allow(null),
  quantity: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().required().default('now('),
  updated_at: Joi.date().iso().required().default('now('),
  @@index([customer_id],: Joi.any().required(),
  @@index([return_id],: Joi.any().required(),
  @@index([return_order],: Joi.any().required()
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

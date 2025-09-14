import Joi from 'joi';

export const member_addressesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  member_id: Joi.number().integer().positive().required(),
  zipcode: Joi.number().integer().positive().required(),
  city: Joi.string().max(16).trim().required(),
  area: Joi.string().max(16).trim().required(),
  street: Joi.string().max(255).trim().required(),
  name: Joi.string().max(32).trim().required(),
  mobile: Joi.string().max(16).trim().required(),
  phone: Joi.string().max(20).trim().allow(null),
  is_main: Joi.boolean().allow(null).default('false'),
  created_at: Joi.date().iso().allow(null).default('now('),
  updated_at: Joi.date().iso().allow(null).default('now('),
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

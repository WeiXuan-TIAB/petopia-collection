import Joi from 'joi';

export const content_detailsSchema = Joi.object({
  content_id: Joi.number().integer().positive().required(),
  content: Joi.string().min(2).max(100).trim().allow(null),
  video_url: Joi.string().max(255).trim().allow(null),
  cover_url: Joi.string().max(255).trim().allow(null),
  duration: Joi.number().integer().positive().allow(null),
  description: Joi.string().max(1000).allow('').allow(null)
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

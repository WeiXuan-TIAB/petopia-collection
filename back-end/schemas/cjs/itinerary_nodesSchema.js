const Joi = require('joi');

const itinerary_nodesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  itinerary_id: Joi.number().integer().positive().required(),
  activity_name: Joi.string().max(255).trim().required(),
  description: Joi.string().max(1000).allow('').allow(null),
  activity_date: Joi.date().iso().required(),
  time_slot: Joi.string().max(10).trim().required(),
  location: Joi.string().max(255).trim().allow(null),
  @@index([itinerary_id],: Joi.any().required()
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

module.exports = { itinerary_nodesSchema };

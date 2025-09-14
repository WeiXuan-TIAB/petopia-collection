const Joi = require('joi');

const itinerary_order_nodesSchema = Joi.object({
  itinerary_orders_id: Joi.number().integer().positive().required(),
  itinerary_nodes_id: Joi.number().integer().positive().required(),
  created_at: Joi.date().iso().required().default('now('),
  @@id([itinerary_orders_id,: Joi.any().required(),
  @@index([itinerary_nodes_id],: Joi.any().required()
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

module.exports = { itinerary_order_nodesSchema };

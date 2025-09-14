import Joi from 'joi';

export const itinerary_locationsSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  itinerary_id: Joi.number().integer().positive().required(),
  country: Joi.string().max(100).trim().required(),
  Prefecture: Joi.string().max(100).trim().required(),
  Place: Joi.string().max(100).trim().required(),
  itineraries: Joi.any().required(),
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

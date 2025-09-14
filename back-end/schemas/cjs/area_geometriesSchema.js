const Joi = require('joi');

const area_geometriesSchema = Joi.object({
  id: Joi.number().integer().positive().required().default('autoincrement('),
  place_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid('point', 'polygon', 'circle').required(),
  data: Joi.any().required(),
  places: Joi.any().required(),
  @@index([place_id],: Joi.any().required()
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

module.exports = { area_geometriesSchema };

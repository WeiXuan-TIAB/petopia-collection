import Joi from 'joi';

export const reservation_seatsSchema = Joi.object({
  reservation_id: Joi.number().integer().positive().required(),
  seat_id: Joi.number().integer().positive().required(),
  created_by: Joi.number().integer().positive().allow(null),
  created_at: Joi.date().iso().allow(null).default('now('),
  @@id([reservation_id,: Joi.any().required(),
  @@index([created_by],: Joi.any().required(),
  @@index([seat_id],: Joi.any().required()
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

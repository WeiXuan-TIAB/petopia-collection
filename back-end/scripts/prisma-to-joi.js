import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 取得 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 路徑設定
const inputFile = path.join(__dirname, '../prisma/schema.prisma');
const outputDirESM = path.join(__dirname, '../schemas/esm');
const outputDirCJS = path.join(__dirname, '../schemas/cjs');

// 確保輸出資料夾存在
fs.mkdirSync(outputDirESM, { recursive: true });
fs.mkdirSync(outputDirCJS, { recursive: true });

// Prisma 型別轉 Joi 規則
function mapPrismaToJoi(field, type, isOptional, constraints, enumMap) {
  let joiRule = '';

  if (enumMap[type]) {
    joiRule = `Joi.string().valid(${enumMap[type].map(v => `'${v}'`).join(', ')})`;
  } else {
    switch (type) {
      case 'Int':
        joiRule = 'Joi.number().integer().positive()';
        break;
      case 'Decimal':
        joiRule = 'Joi.number().positive().precision(2)';
        break;
      case 'Boolean':
        joiRule = 'Joi.boolean()';
        break;
      case 'DateTime':
        joiRule = 'Joi.date().iso()';
        break;
      case 'String':
        if (field.toLowerCase().includes('email')) {
          joiRule = 'Joi.string().email().lowercase()';
        } else if (field.toLowerCase().includes('phone') || field.toLowerCase().includes('mobile')) {
          joiRule = "Joi.string().pattern(/^09\\d{8}$/).message('手機號碼格式錯誤')";
        } else if (field.toLowerCase().includes('status')) {
          joiRule = "Joi.string().valid('active', 'inactive').default('active')";
        } else if (field.toLowerCase().includes('description')) {
          joiRule = "Joi.string().max(1000).allow('')";
        } else {
          joiRule = 'Joi.string().min(2).max(100).trim()';
        }
        break;
      default:
        joiRule = 'Joi.any()';
    }
  }

  const varcharMatch = constraints.match(/@db\.VarChar\((\d+)\)/);
  if (varcharMatch) {
    joiRule = `Joi.string().max(${varcharMatch[1]}).trim()`;
  }

  if (isOptional) {
    joiRule += '.allow(null)';
  } else {
    joiRule += '.required()';
  }

  const defaultMatch = constraints.match(/@default\(([^)]+)\)/);
  if (defaultMatch) {
    const defaultVal = defaultMatch[1].replace(/"/g, '');
    joiRule += `.default(${isNaN(defaultVal) ? `'${defaultVal}'` : defaultVal})`;
  }

  return joiRule;
}

// 讀取 schema.prisma
const schemaContent = fs.readFileSync(inputFile, 'utf-8');

// 抓出所有 enum
const enumRegex = /enum\s+(\w+)\s+\{([^}]+)\}/g;
let enumMap = {};
let enumMatch;
while ((enumMatch = enumRegex.exec(schemaContent)) !== null) {
  const enumName = enumMatch[1];
  const enumValues = enumMatch[2].trim().split('\n').map(v => v.trim()).filter(Boolean);
  enumMap[enumName] = enumValues;
}

// 抓出所有 model
const modelRegex = /model\s+(\w+)\s+\{([^}]+)\}/g;
let match;

while ((match = modelRegex.exec(schemaContent)) !== null) {
  const modelName = match[1];
  const modelBody = match[2].trim();

  const joiFields = modelBody.split('\n').map(line => {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 2) return null;
    const [field, typeRaw, ...rest] = parts;
    if (typeRaw.endsWith('[]')) return null;

    const isOptional = typeRaw.endsWith('?');
    const type = typeRaw.replace('?', '');
    const constraints = rest.join(' ');

    return `  ${field}: ${mapPrismaToJoi(field, type, isOptional, constraints, enumMap)}`;
  }).filter(Boolean).join(',\n');

  // CJS 模板
  const joiSchemaCJS = `const Joi = require('joi');

const ${modelName}Schema = Joi.object({
${joiFields}
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

module.exports = { ${modelName}Schema };
`;

  // ESM 模板
  const joiSchemaESM = `import Joi from 'joi';

export const ${modelName}Schema = Joi.object({
${joiFields}
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
`;

  fs.writeFileSync(path.join(outputDirCJS, `${modelName}Schema.js`), joiSchemaCJS, 'utf-8');
  fs.writeFileSync(path.join(outputDirESM, `${modelName}Schema.js`), joiSchemaESM, 'utf-8');

  console.log(`✅ ${modelName}Schema 已生成：schemas/esm/ & schemas/cjs/`);
}

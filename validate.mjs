import fs from 'fs';
import Ajv from 'ajv';

const jsonFilePath = './waapiti.json';
const jsonData = fs.readFileSync(jsonFilePath, 'utf8');

const ajv = new Ajv();

ajv.addFormat('arrayString', {
  validate: (schema, data) => {
    console.log('data', data);
    if (typeof data === 'string') {
      try {
        JSON.parse(data);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  },
});

const property = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1, maxLength: 50 },
    type: {
      type: 'string',
      enum: ['image', 'video', 'text', 'textarea', 'object', 'color', 'position', 'number', 'location'],
    },
    value: { type: 'string' },
    optional: { type: 'boolean' },
  },
  required: ['name', 'type', 'value'],
  additionalProperties: false,
};

const schema = {
  type: 'object',
  properties: {
    vars: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    config: {
      type: 'object',
      properties: {
        tplBaseVersion: { type: 'integer', minimum: 5 },
        type: { type: 'string', enum: ['template'] },
        title: { type: 'string', minLength: 1, maxLength: 50 },
        duration: { type: 'integer', minimum: 1 },
        defaultPreviewOrientation: {
          type: 'string',
          enum: ['portrait', 'landscape'],
        },
        responsive: { type: 'boolean' },
        scaledPreview: { type: 'boolean' },
        screenshot: { type: 'string', enum: ['portrait', 'landscape', 'thumbnail'] },
      },
      required: ['tplBaseVersion', 'type', 'title', 'duration', 'defaultPreviewOrientation', 'responsive', 'scaledPreview'],
      additionalProperties: false,
    },
  },
};

function generateValue(variable) {
  const args = { ...property };

  if (variable.selectable) {
    args.properties['selectable'] = {
      type: 'object',
      properties: {
        values: {
          oneOf: [{ type: 'string' }, { type: 'array' }],
        },
        customizable: {
          oneOf: [{ type: 'string' }, { type: 'boolean' }],
        },
      },
      required: ['values', 'customizable'],
      additionalProperties: false,
    };
  }

  if (variable.array) {
    if (args.properties['selectable']) {
      args.properties['selectable'] = {
        not: args.properties['selectable'],
      };
    }
    args.properties['array'] = {
      type: 'object',
      properties: {
        min: { type: 'integer', minimum: 0 },
        max: { type: 'integer', minimum: 0 },
      },
      required: ['min', 'max'],
      additionalProperties: false,
    };
  }

  if (variable.properties) {
    // args.properties.type.enum = ['object'];

    args.properties['properties'] = {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9_]*$': {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 50 },
            type: {
              type: 'string',
              enum: ['image', 'text', 'textarea', 'color', 'position', 'number', 'location'],
            },
            optional: { type: 'boolean' },
            array: {
              oneOf: [{ type: 'string' }, { type: 'boolean' }],
            },
          },
        },
      },
    };
  }

  if (variable.customValue) {
    args.properties['customValue'] = { type: 'boolean' };
  }

  if (variable.coordinates) {
    args.properties.type.enum = ['position'];

    args.properties['coordinates'] = {
      type: 'object',
      properties: {
        x: {
          type: 'object',
          properties: {
            min: { type: 'integer', minimum: 0 },
            max: { type: 'integer', minimum: 0 },
            steps: { type: 'integer', minimum: 0 },
          },
          required: ['min', 'max', 'steps'],
          additionalProperties: false,
        },
        y: {
          type: 'object',
          properties: {
            min: { type: 'integer', minimum: 0 },
            max: { type: 'integer', minimum: 0 },
            steps: { type: 'integer', minimum: 0 },
          },
          required: ['min', 'max', 'steps'],
          additionalProperties: false,
        },
      },
    };
  }

  if (variable.number) {
    args.properties.type.enum = ['number'];

    args.properties['number'] = {
      type: 'object',
      properties: {
        min: { type: 'integer', minimum: 0 },
        max: { type: 'integer', minimum: 0 },
        slider: { type: 'boolean' },
      },
    };
  }

  // switch (variable.type) {
  //   case 'object':
  //   case 'location':
  //   case 'position':
  //     args.properties.value = { type: 'object', properties: {}, additionalProperties: true };
  //     break;
  //   default:
  //     break;
  // }
  return args;
}

try {
  const data = JSON.parse(jsonData);

  for (const [key, value] of Object.entries(data.vars)) {
    schema.properties.vars.properties[key] = generateValue(value);
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.log(validate.errors);
  } else {
    console.log('JSON válido');
  }
} catch (error) {
  console.error('El archivo JSON no tiene un formato válido:', error);
  process.exit(1); // Termina el proceso con un código de error
}

/* globals logger */

const { US_STATES } = require('..');

class FieldValidation {
  constructor({ attributes, validations, defaultRequired = true }) {
    this.attributes = attributes;
    this.validations = validations;
    this.defaultRequired = defaultRequired;
  }

  extend({ validations = [], attributes = {}, defaultRequired = this.defaultRequired } = {}) {
    return new FieldValidation({
      validations: [...this.validations, ...validations],
      attributes: { ...this.attributes, ...attributes },
      defaultRequired,
    });
  }
}

FieldValidation.zip = new FieldValidation({
  attributes: {
    type: 'text',
    minlength: 5,
    maxlength: 5,
    pattern: '[0-9]{5}',
    'aria-label': 'The accepted zip code format is five numbers',
  },
  validations: ['minLength:5', 'maxLength:5', 'numeric'],
});

FieldValidation.date = new FieldValidation({
  attributes: { placeholder: 'mm-dd-yyyy', maxlength: 20, type: 'date' },
  validations: ['maxLength:20', 'parsableDate'],
});

FieldValidation.email = new FieldValidation({
  attributes: {
    placeholder: 'you@example.com',
    type: 'email',
  },
  validations: ['email'],
});

FieldValidation.text = new FieldValidation({
  attributes: { maxlength: 128, type: 'text' },
  validations: ['maxLength:128'],
});

FieldValidation.textMedium = new FieldValidation({
  attributes: {
    maxLength: 152,
  },
  validations: ['maxLength:152'],
});

FieldValidation.textLong = new FieldValidation({
  attributes: { required: 'required', maxlength: 256 },
  validations: ['required', 'maxLength:256'],
});

FieldValidation.phone = new FieldValidation({
  attributes: {
    placeholder: '(555) 555-5555',
    minlength: 9,
    maxlength: 14,
    type: 'tel',
  },
  validations: ['maxLength:14', 'minLength:9'],
});

FieldValidation.ssn = new FieldValidation({
  attributes: {
    placeholder: 'AAA-GG-SSSS',
    minlength: 9,
    maxlength: 11,
    /**
     * Not using \d to keep eslint and prettier from fighting
     * over the "useless" escape that is actually necessary for
     * the HTML input pattern attribute:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-pattern
     */
    pattern: '[0-9]{3}[-_ ]?[0-9]{2}[-_ ]?[0-9]{4}',
    'aria-label':
      'The accepted SSN format is three numbers, a hyphen, two numbers, a hyphen, four numbers',
  },
  validations: ['alphaDash', 'minLength:9', 'maxLength:11', 'ssn'],
});

FieldValidation.currency = new FieldValidation({
  attributes: {
    placeholder: '$0.00',
    min: 0,
    step: '0.01',
    type: 'number',
  },
  validations: ['numeric', 'greaterThan:0'],
});

FieldValidation.usStates = new FieldValidation({
  attributes: {},
  validations: [`oneOf: ${US_STATES.join(', ')}:false`],
});

FieldValidation.yesno = new FieldValidation({
  attributes: {},
  validations: ['oneOf:yes,no:false'],
});

FieldValidation.checkbox = new FieldValidation({
  attributes: {},
  validations: ['oneOf:on,off'],
});

class Field {
  constructor({ validations = [], attributes = {}, required, ...rest } = {}) {
    logger.info(rest.name);
    // Grabs all the other things like name, type, label, etc.
    Object.keys(rest).forEach(k => (this[k] = rest[k]));

    if (this.type === 'checkbox') {
      validations = FieldValidation.checkbox;
    }

    // Allow passing in the enum reference
    if (validations instanceof FieldValidation) {
      this.validations = [...validations.validations];
      this.attributes = { ...validations.attributes, ...attributes };
      required = required !== undefined ? required : validations.defaultRequired;
    } else if (Array.isArray(validations)) {
      // Otherwise we can parse the attributes from the validations
      this.validations = validations;
      this.attributes = Field.getAttributesFromValidations(this.validations, attributes);
    }

    this.required = required === undefined ? true : !!required;

    if (this.required === true) {
      this.validations.push('required');
      this.attributes.required = 'required';
    }

    if (this.yesno) {
      if (Array.isArray(this.fields)) Field.mapFieldsToDependOn(this.name, this.fields);
    }

    if (this.yesno || this.type === 'yesno') {
      this.validations = [...this.validations, ...FieldValidation.yesno.validations];
      this.attributes = { ...this.attributes, ...FieldValidation.yesno.attributes };
    }
  }

  static getAttributesFromValidations(validations, attributes = {}) {
    return validations.reduce((attrs, validation) => {
      if (validation.startsWith('maxLength')) {
        return Object.assign({ maxlength: validation.split(':')[1] }, attrs);
      } else if (validation.startsWith('minLength')) {
        return Object.assign({ minlength: validation.split(':')[1] }, attrs);
      }

      return attrs;
    }, attributes);
  }

  static mapFieldsToDependOn(dependOn, fields) {
    fields.forEach(row =>
      row.forEach(field => {
        if (field.validations) {
          field.validations.push(`dependsOn:${dependOn}`);
        }

        if (field.fields) {
          Field.mapFieldsToDependOn(dependOn, field.fields);
        }
      }),
    );
  }
}

Field.FieldValidation = FieldValidation;
Field.US_STATES = US_STATES;

module.exports = Field;

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
  attributes: { placeholder: 'mm-dd-yyyy', maxlength: 20 },
  // Don't add the maxLength validation as you should be able to pass any
  // formatted string including ISO which exceeds 20 characters but on the
  // front-end we want to make it so folks type in something formatted
  // approximately normal like MM/DD/YYYY
  validations: ['parsableDate'],
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
    pattern:
      // This will allow pretty much any string as long as it starts
      // and ends with a number and contains 9 numbers
      '[0-9][^0-9]*?[0-9][^0-9]*?[0-9][^0-9]*?[0-9][^0-9]*?[0-9][^0-9]*?[0-9][^0-9]*?[0-9][^0-9]*?[0-9][^0-9]*?[0-9]',
    'aria-label': 'A valid SSN has 9 digits in it. Any character may be used as a separator',
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
  validations: ['oneOf:yes,no'],
});

class Field {
  constructor({ validations = [], attributes = {}, required, ...rest } = {}) {
    // Grabs all the other things like name, type, label, etc.
    Object.keys(rest).forEach(k => (this[k] = rest[k]));

    if (this.type === 'checkbox') {
      validations = FieldValidation.checkbox;
      required = false;
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

      if (this.attributes.required === false) {
        delete this.attributes.required;
      } else {
        this.attributes.required = 'required';
      }
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
      if (typeof validation !== 'string') {
        throw new Error('Trying to add attributes over invalid validations');
      }

      if (validation.indexOf('maxLength') === 0) {
        return Object.assign({ maxlength: validation.split(':')[1] }, attrs);
      }

      if (validation.indexOf('minLength') === 0) {
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

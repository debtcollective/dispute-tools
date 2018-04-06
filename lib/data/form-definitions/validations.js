const _ = require('lodash');

class FieldValidation {
  constructor({ attributes, validations }) {
    this.attributes = attributes;
    this.validations = validations;
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
  validations: ['maxLength:20'],
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
      'The accepted SSN format is three numbers, a space, two numbers, a space, four numbers',
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
  validations: ['number'],
});

class Field {
  constructor({ validations = [], attributes = {}, required = true, ...rest }) {
    // Grabs all the other things like name, type, label, etc.
    Object.keys(rest).forEach(k => (this[k] = rest[k]));

    // Allow passing in the enum reference
    if (validations instanceof FieldValidation) {
      this.validations = [...validations.validations];
      this.attributes = { ...validations.attributes };
      required = required !== undefined ? required : validations.defaultRequired;
    } else if (validations !== undefined) {
      // Otherwise we can parse the attributes from the validations
      this.validations = validations;
      this.attributes = Field.getAttributesFromValidations(this.validations, attributes);
    }

    if (required === true) {
      this.validations.push('required');
      this.attributes.required = 'required';
    }

    if (this.type === 'keyvalue') {
      this.fields = [
        ...(this.fields || []),
        ...Field.fieldsFromKeys(this.keys, this.valueType, validations),
      ];
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

  /**
   * Maps string or number keys to a list of fields
   * @param {string[]} keys The list of keys to map to fields
   * @param {'number'|'text'} valueType The value types of the input fields
   * @param {FieldValidation} validations Validations to apply to all the fields
   * @param {number} groupSize The number of elements to group together. Defaults to 2
   * @return {Field[]} The list of fields
   */
  static fieldsFromKeys(keys, valueType, validations, groupSize = 3) {
    const fields = keys.map(
      k =>
        new Field({
          label: k,
          name: k.toLowerCase().replace(/ /g, '-'),
          type: valueType,
          columnClassName: `md-col-${Math.floor(12 / groupSize)}`,
          validations,
        }),
    );

    if (!groupSize || groupSize === 1) return fields;

    return Field.tuple(fields, groupSize);
  }

  /**
   * Groups a list into a list of tuples to the given size
   *
   * @example
   *
   * const list = [1, 2, 3, 4, 5]
   * tuple(list, 2) //=> [[1, 2], [3, 4], [5]];
   *
   * @param {any[]} list List of anything
   * @param {number} size Number of elements per tuple
   * @return {any[][]} List of tuples
   */
  static tuple(list, size = 2) {
    return _.range(0, list.length, size).reduce(
      (tuples, step) => [...tuples, list.slice(step, step + size)],
      [],
    );
  }
}

Field.FieldValidation = FieldValidation;
Field.US_STATES = require('..').US_STATES;

module.exports = Field;

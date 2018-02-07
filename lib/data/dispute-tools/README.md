# Dispute Tool Information Gathering Form Configuration

Part of The Debt Collective's mission is to ensure that our members have easy access to the regulated forms necessary for disputing certain types of debt. While our rendering pipeline handles the actual _rendering_ of the output documents our members use, the forms that collect the information from then in the first place are configured declaratively. This directory contains those definitions.

Given the relative complexity of the types of elements our forms are able to be generated into, our HTML form generation is _super_ fast, consistent, accessible, and easy for a developer to manipulate. However, there are some oddities and specific implementation details that may not be clear from the get go. What follows is a description of the general structure of the form definitions, the entities present, the default values, and some helpful hints.

An annotated TypeScript definition file lives in `structure.d.ts` in this directory.

More generally, a dispute tool consists of steps. Each step consists of a series of information forms the member needs to fill out or document requirements that the member must supply for the dispute process. See the aforementioned definition file for a technical definition of how fields work.

## `Field` class notes

### `yesno == true` vs `type == 'yesno'`

What the heck is the difference? It's a little confusing at first, but the difference is actually clear.

When `type == 'yesno'`, the rendered form control will be a radio button where the label is posed as a yes or no question. The radio options are automatically configured to be `Yes` and `No`.

When `yesno == true`, the field will also be rendered as a form control, like when `type == 'yesno'`, _however_, you will have to supply an array of `Field`s to the `fields` parameter. These fields will be rendered as required fields _only when the answer to the yes/no question was yes._ This is super useful for when the form being rendered asks questions like "Are you the parent or the student"? Then we can as the member filling out our form, are you the parent? If yes, go ahead and fill out the information for the student below. We use these **a ton** all over the place and they're on of our more useful constructs.

### Alerts

Sometimes the answer to a `yesno == true` field renders the applicant disqualified from the dispute tool they're working on. In those cases, we can supply an alert object to the `Field` constructor which will display an alert below the form control when the corresponding option is selected. See `structure.d.ts` for more information about this and how to configure it properly.

### `columnClassName`

These are passed for when you want multiple form controls to be rendered in the same row as each other, like for city, state, zip. In that case you must hand configure the width of each form element using [BassCSS grid column class names](http://basscss.com/#responsive-grid).

### `validations`

The `FieldValidation` enum is defined in `validations.js` in this folder. The enum consists of both a map of HTML attributes to be applied to the form control and an array of [Checkit](https://github.com/tgriesser/checkit) validation strings. Attributes and validations should roughly match each other. We define custom Checkit validations in the `shared/Checkit.js` module for things like social security numbers which aren't supported by Checkit. Unfortunately, Checkit is not actively maintained so we need to hack at it to get the custom validations we need. At least JavaScript makes it easy to do so! There's a good example of that for SSNs already.

Except for specific one-offs, each new type of field that we come across should get a validation scheme defined as an instance of `FieldValidation` like so:

```javascript
FieldValidation.zip = new FieldValidation({
    attributes: {
        type: 'text',
        minlength: 5,
        maxlength: 5,
        pattern: '[0-9]{5}',
        // ... any other valid HTML form control attributes may be defined here
    },
    // Checkit validation strings that match the HTML attributes
    validations: ['minLength:5', 'maxLength:5', 'numeric'],
});
```

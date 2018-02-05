# Rendering pipelines

There are currently two rendering pipelines: `pdf` and `pug`.
At the end of the day, both produce PDF files of rendered dispute forms and letters.
Each dispute configuration can have multiple documents, each with several `DisputeTemplate`s associated with them.
The `credit-report-dispute-letter` for example, is a single document with two pug templates.
On the other hand, option C of the `tax-offset-review` dispute, has two separate documents with a single template each.
The rendering pipeline used depends on the type defined on the template configuration, so a given document is free to use multiple pipelines.

## Pug

The pug pipeline is used for the various letters we can generate for our users to mail to collectors. HTML based rendering is ideal for these letters because HTML, at its core, is meant for displaying documents. These specific documents are able to be maintained as single pages and can be quickly iterated on to fix errors or change the content. The template configuration consists solely of a pug file with the pug template and styles together and a `normalize` function that takes the data collected from the user and returns an object of the locals to be used in the template.

## PDF

The PDF pipeline is the most complicated pipeline we support and is used to fill PDF forms directly.

### The FDF Document

Each PDF form has something called an `fdf` document associated with it. To generate it, you simply run the following `pdftk` command:

```bash
pdftk path/to/file.pdf dump_data_fields output path/to/output.fdf
```

We keep these FDF files next to the PDFs for documentation purposes, so if you're adding a new PDF form, go ahead and save the FDF alongside it. `FieldType`, `FieldName`, and `FieldStateOption`s are the properties that concern us.

### Normalize

The `normalize` function returns a dictionary where the keys are taken from the `fdf` document (`FieldName`).

If `FieldType` is text, then `normalize` returns a dictionary where the key is the `FieldName` and the value is a string:

```
---
FieldType: Text
FieldName: topmostSubform[0].Page1[0].Name[0]
FieldNameAlt: Name.
FieldFlags: 8388608
FieldJustification: Left
---
```

```javascript
const name = 'Alexandre Marcondes';

return {
  'topmostSubform[0].Page1[0].Name[0]': name,
};
```

If `FieldType` is `Button`, then that's the equivalent of a checkbox on a PDF form.
Each button has two states, listed as `FieldStateOption`s.
The off or unchecked `FieldStateOption` is usually `Off`.
The other `FieldStateOption` is the on or checked value (`1` or `2` in the example below).

When there's a list of checkboxes, they're usually grouped in an array with their on value being their index + 1.

Checkboxes are off by default.
To set a checkbox as on, `normalize` returns a dictionary where the key is the `FieldName` and the value is the checked `FieldStateOption`.

```
---
FieldType: Button
FieldName: topmostSubform[0].Page1[0].Applying[0]
FieldNameAlt: 1. You are applying for this loan discharge as a Student borrower &#8211; Skip to Item 4.
FieldFlags: 0
FieldValue: Off
FieldJustification: Left
FieldStateOption: 1
FieldStateOption: Off
---
FieldType: Button
FieldName: topmostSubform[0].Page1[0].Applying[1]
FieldNameAlt: 1. You are applying for this loan discharge as a Parent borrower &#8211; Continue to Item 2.
FieldFlags: 0
FieldValue: Off
FieldJustification: Left
FieldStateOption: 2
FieldStateOption: Off
---
```

```javascript
const ret = {};
// Collected from the user
const applyingAsStudent = form['applying-as'];

// These are saved as yes
if (applyingAsStudent === 'yes') {
  ret['topmostSubform[0].Page1[0].Applying[0]'] = '1';
else {
  ret['topmostSubform[0].Page1[0].Applying[1]'] = '2';
}

return ret;
```

### Post

The PDF pipeline also supports a `post` function (or array of functions) which takes an instance of `hummus-recipe` piped to the PDF _after_ it's been filled out and the data collected from the user. This function is used to apply non-form based transformations to the PDF like rendering a digital signature or appending a plaintext note at the end. Anytime we can do something using the form data fields, we should do it that way. The post functions should be used sparingly to reduce the complexity and maintain specificity.

# Additional notes

* Refer to the `DisputeTemplate` class for documentation regarding certain implementation details.
* Keep documents that will be shared between dispute tools in the shared folder
* For the PDF pipeline, because the templates can get rather long, keep it to a single template per file.
* To add a new dispute tool, export a file or folder from `services/renderers/tool-configurations` named after the dispute tool that exports an object with the path `disputeToolId: String -> options{} -> documents{} -> templates[]` like so:

```javascript
module.exports = {
    '12345-12345-1234-12345-12345': {
        A: {
            document_one: {
                templates: [new DisputeTemplate(disputeTemplateConfig)], // you should import the template or the entire document if possible
            },
        },
        B: {
            document_one: {
                templates: [],
            },
            document_two: {
                templates: [],
            },
        },
    },
};
```
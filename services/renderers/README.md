# Rendering pipelines

There are currently three rendering pipelines, `legacy`, `pdf`, and `pug`. At the end of the day, all three produce PDF files of rendered dispute forms and letters. Each dispute configuration can have multiple documents, each with several `DisputeTemplate`s associated with them. The `credit-report-dispute-letter` for example, is a single document with two pug templates. On the other hand, option C of the `tax-offset-review` dispute, has two separate documents with a single template each. The rendering pipeline used depends on the type defined on the template configuration, so a given document is free to use multiple pipelines.

## Legacy 

The legacy pipeline is almost completely phased out. It uses [`graphicsmagick`](http://www.graphicsmagick.org/) to manipulate PNG snapshots of the supported letters and PDF forms directly by overlaying text in specific areas then embedding the PNG into a multi-page PDF document. Aside from not producing actual text-based PDFs, this was costly to create and maintain and ultimately produced sub-par documents that looked un-professional and hastily put together. There were also specific issues brought up around the difficulty of maintaining dynamic content of variable/unknown length. See: [#279](https://gitlab.com/debtcollective/debtcollective/issues/279), [#281](https://gitlab.com/debtcollective/debtcollective/issues/281). The pug and PDF pipelines were created to replace the legacy pipeline.

## Pug

The pug pipeline is used for the various letters we can generate for our users to mail to collectors. HTML based rendering is ideal for these letters because HTML, at its core, is meant for displaying documents. These specific documents are able to be maintained as single pages and can be quickly iterated on to fix errors or change the content. The template configuration consists solely of a pug file with the pug template and styles together and a `normalize` function that takes the data collected from the user and returns an object of the locals to be used in the template.

## PDF

The PDF pipeline is the most complicated pipeline we support and is used to fill PDF forms directly. 

### Normalize 

Each PDF form has something called an `fdf` document associated with it. To generate it, you simply run the following `pdftk` command:

```bash
pdftk path/to/file.pdf dump_data_fields output path/to/output.fdf
```

That will generate a file looking roughly like:

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
FieldType: Text
FieldName: topmostSubform[0].Page1[0].Phone2[0]
FieldNameAlt: Telephone &#8211; Alternate. Enter 10 digit telephone number including area code. If applicable, enter country code.
FieldFlags: 8388608
FieldJustification: Left
---
FieldType: Text
FieldName: topmostSubform[0].Page1[0].Name[0]
FieldNameAlt: Name.
FieldFlags: 8388608
FieldJustification: Left
---
FieldType: Text
FieldName: topmostSubform[0].Page1[0].Address[0]
FieldNameAlt: Address.
FieldFlags: 8388608
FieldJustification: Left
---
```

We keep these FDF files next to the PDFs for documentation purposes, so if you're adding a new PDF form, go ahead and save the FDF alongside it. `FieldType`, `FieldName`, and `FieldStateOption`s are the properties that concern us. If `FieldType` is text, then `normalize` on the template configs just needs to return an object that has the `FieldName` as a property:

```javascript
const name = 'Alexandre Marcondes';

return {
  'topmostSubform[0].Page1[0].Name[0]': name,
};
```

If it's a `Button` then that's the equivalent of a checkbox on a PDF form. Each button has two states, listed as `FieldStateOption`s. The off or unchecked option is usually `Off` and is the default state for a PDF button. The other option listed is the on value. When there's a list of checkboxes, they're usually grouped in an array with their on value being their index + 1. Usually the Yes option is `1` and the No is `2` for this reason. To set a checkbox as on, `normalize` just needs to return an object with the on value. If it's off then there's no need to set the property to anything as off is the default:

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
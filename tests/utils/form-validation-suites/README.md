# Form validation tests

These tests describe the behavior of our form-validation suite built on top of Checkit, a JavaScript library that is declaratively configured to validate input data. It works based on a series of validation keys like `'required'`, `'maxLength:256'` etc, that are pretty self explanatory. Our tests specifically describe the behavior of each form field and its expected constraints. If a field has a maximum length of 256 characters, then describe it using the `text.long` suite which encapsulates tests for max length and whether the field is required. All of our FieldValidation (`lib/data/form-validations/validations.js`) instances already have suites to describe their behavior making it trivially easy to add tests for a new form field.

As much as we can, we've tried to encapsulate each form into it's own module of tests that can be repeated on any dispute configuration. For this reason, everything past the top level takes a callback that should return the configured dispute being tested. This lets Mocha configure the test suite before running the tests without any magic of juggling dispute variable instances.

There are a lot of tests here, approximately 23 thousand run each time. Luckily, they're very fast to run and pretty fun to write.

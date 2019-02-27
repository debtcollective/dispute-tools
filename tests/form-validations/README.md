# Deprecated
The approach intended here is broken and it is not worthy to fix. Keep reading in order to have more context.

## Facts
1. Forms has constraints to determine if a form data is valid or not
1. Each form use `Field` objects which has a compount set of rules to determine if that Field value is valid
1. Tests are written using helpers that abstract cases for **each specfic rule**
1. A lifecycle of a test within this folder is:
  - Test get the target form and constraints
  - For each field within the form call an abstraction of assertions for each rule of that field. For instance, a Field "name" with rules `[minLenght:9, maxLenght:11]` will call abstracted assertions for minLenght and then do the same for maxLenght.

## Conclusion
By abstracting tests by rules but not by specific Field needs we can ending up by having a need of: `[minLenght:9, maxLenght:11]` and test `minLenght` with 8 characters and `maxLenght` with 12 characters, so the rule itself works but we are trying to test without taking into count specific needs.

In order to make sure to have illustrative ways to explain the above idea check cases like:
- [Testing `alphaDash` rule with more characters than the one allowed by the Field](./docs/img/case_2.jpg)
- [Testing `minLenght` with less amount of characters than the Field need](./docs/img/case_1.jpg)
# Validation

Home cooked validation library consists of two components

`ValidatorForm` and `Validator`. `Validator` 

## Rules

A rule is just a list of either `rule: string` or an object with `{rule: string, ... other values}`
Rules are registred with `registredRule` which is exported by `validation.js`

```javascript
registerRule('between', (value, {min, max}) => value >= min && value <= max)
```

The rule can't be async as of now. If the rule fails will it create an error message by calling
$t(`_validation_${rule.rule}`, {field: $t(name), ...rule)} so for example


## Validator

It watches a value and then it changes does run rules on the value. First rule failing
is shown as an error in human-readable form (uses vue-i18n)

## ValidatorForm

It stores all Validator instances declared inside it. And it exposes the method
validate which runs validation on all Validators it returns

```javascript
{
  errors: [...],
  sucess: true || false
}
```

errors is an object with the following properties

name: The name of the Validator
error: The human readable error message
rule: The name of rule which failed
import VValidator from './VValidator.vue'
import VForm from './VForm.vue'

/**
 * @typedef {import('./VValidator.vue').default} VValidator
 */

/**
 * @typedef {object} Rule
 * @property {string} rule which rule to run
 * @property {RuleFunction} [func] use this instead of registred function (optional)
 * @property [key: string]: any;
 */

/**
 * @callback RuleFunction
 * @param {any} value
 * @param {Rule} rule
 * @returns {boolean}
 */

/**
 * @type {Map<string, RuleFunction>} ruleFunc
 */
const ruleFunc = new Map()
/**
 * Register an validator rule by name
 * Rule should take two argument value and a rule object
 * @param {String} ruleName
 * @param {RuleFunction} func
 */
export function registerRule (ruleName, func) {
  ruleFunc.set(ruleName, func)
}

/**
 * Validate a value against a list of rules
 *
 * @param {any} value to be validated
 * @param {Rule[]} rules to validate
 * @returns {Rule | null} rule which failed or null if success
 */
export function _validateRules (value, rules) {
  for (const rule of rules) {
    const f = rule.func ?? ruleFunc.get(rule.rule)
    if (!f) {
      throw new Error(`Unknown rule "${rule.rule}"`)
    }
    try {
      const ruleSucceded = f(value, rule)
      // console.log('validating', value, rule, ruleSucceded)

      if (!ruleSucceded) {
        return rule
      }
    } catch {
      console.log('validating catch', value, rule)
      return rule
    }
  }
  return null
}

export let _messageGenerator = (name, rule) => `${rule.rule}: ${name} (${JSON.stringify(rule)})`
export function registerMessageGenerator (f) {
  _messageGenerator = f
}

/**
 *
 * @param {VValidator[]} validators
 * @returns
 */
export function _validateAll (validators) {
  const errors = []
  for (const validator of validators) {
    const result = validator.validate()
    if (result) {
      errors.push(result)
    }
  }
  return { errors, valid: errors.length === 0 }
}

export {
  VValidator,
  VForm
}

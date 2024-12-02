<template>
  <!-- <v-validator> -->
  <slot :state="state" :validate="validate" :error="error" />
  <!-- </validator> -->
</template>

<script>
import { _validateRules, _messageGenerator } from './validation.js'
export default {
  name: 'VValidator',
  props: {
    value: { type: [Object, String, Boolean, Number, null], required: true },
    name: { type: String, required: true },
    rules: { type: [Object, String, Array], required: true },
    deep: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      state: null,
      error: '',
      unwatch: null,
      form: null
    }
  },
  computed: {
    parsedRules () {
      if (typeof this.rules === 'string') {
        if (this.rules === '') {
          return []
        }
        return this.rules.split('|').map(s => ({ rule: s }))
      }
      return this.rules.map(r => typeof r === 'string' ? { rule: r } : r)
    }
  },
  watch: {
    disabled () {
      this.validate()
    },
    rules () {
      this.validate()
    }
  },
  mounted () {
    this.unwatch = this.$watch('value', this.validate, { deep: this.deep })
    let parent = this.$parent
    while (parent) {
      // Could have checked parent.$.type.name also
      if (Object.hasOwn(parent, '_registerValidator')) {
        this.form = parent
        break
      }
      parent = parent.$parent
    }
    if (this.form) {
      this.form._registerValidator(this)
    }
  },
  unmounted () {
    this.unwatch() // Remove watch
    if (this.form) {
      this.form._unregisterValidator(this)
    }
  },
  methods: {
    validate () {
      if (this.disabled) {
        this.error = null
        this.state = null
        return null
      }
      // console.log('validating field', this.name)
      const failedRule = _validateRules(this.value, this.parsedRules)
      if (!failedRule) {
        this.error = null
        this.state = true
        return null
      }
      this.error = _messageGenerator(this.name, failedRule)
      this.state = false
      return { error: this.error, rule: failedRule, name: this.name }
    }
  }
}
</script>

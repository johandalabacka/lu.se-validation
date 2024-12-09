<template>
  <!-- <VForm> -->
  <slot />
  <!-- </VForm> -->
</template>

<script>

/**
 * @typedef {import('./VValidator.vue').default} VValidator
 */

import { _validateAll } from './index.js'

export default {
  name: 'VForm',
  data () {
    return {
      /**
       * @type {Set<VValidator>} validators set of all vvalidators in a form
       */
      validators: new Set()
    }
  },
  methods: {
    /**
     * Register a validator so VForm knowns which to use on validateAll
     * @param {VValidator} validator
     */
    _registerValidator (validator) {
      this.validators.add(validator)
    },
    /**
     * Unregister a validator
     * @param {VValidator} validator
     */
    _unregisterValidator (validator) {
      this.validators.delete(validator)
    },
    /**
     * @returns {<Promise<boolean>} true if all validators are valid
     */
    async validate () {
      const result = await _validateAll(this.validators.values())
      console.log('v-form validate', result)
      return result
    }
  }
}
</script>

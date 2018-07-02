<template>
  <div>
    <label :for="`masked-${name}`" class="inline-block pb1 -fw-600">Amount of Disputed Debt</label>
    <masked-input
      :name="`masked-${name}`"
      :mask="numberMask"
      class="form-control -fw"
      placeholder="$0.00"
      type="text"
      required="required"
      v-model="amount"
    />
    <input :name="name" type="text" aria-hidden="true" class="d-none" :value="cleanedValue" />
  </div>
</template>

<script>
import MaskedInput from 'vue-text-mask';
import createNumberMask from 'text-mask-addons/src/createNumberMask';

export default {
  components: { MaskedInput },
  props: {
    name: {
      type: String,
      required: true,
    },
    initialAmount: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      amount: this.initialAmount,
    };
  },
  computed: {
    cleanedValue() {
      return this.amount.replace(/[^0-9.]/g, '');
    },
  },
  methods: {
    numberMask: createNumberMask({
      prefix: '$',
      allowDecimal: true,
      integerLimit: 6,
    }),
  },
};
</script>

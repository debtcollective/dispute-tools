<template>
  <div>
    <div class="clearfix" v-for="(debt, index) in debts" :key="`debt-${index}`">
      <div :class="`col col-${debt.typeSelected === 'other' ? '2' : '8'} pt2 pr2`">
        <label
          class="inline-block pb1 -fw-500"
          :for="debt.typeSelected === 'other' ? `debt-type[other][${index}]` : `fieldValues[debts][${index}][type]`"
          :id="`debt-type-${index}-l`"
        >Debt type</label>
        <div>
          <select
            class="-fw form-control"
            v-model="debt.typeSelected"
            :name="debt.typeSelected === 'other' ? `debt-type[other][${index}]` : `fieldValues[debts][${index}][type]`"
            @change="debt.typeSelected === 'other' ? (debt.type = '') : (debt.type = debt.typeSelected)"
            :aria-labelledby="`debt-type-${index}-l`"
            required="required"
          >
            <option value disabled hidden :selected="debt.type === ''">Select debt type</option>
            <option
              v-for="debtType in DebtTypes"
              :key="debtType.key"
              :value="debtType.key"
            >{{debtType.value}}</option>
          </select>
          <p class="-on-error -danger -caption -fw-500 mt1"></p>
        </div>
      </div>
      <div v-if="debt.typeSelected === 'other'" class="col col-6 p2">
        <label
          class="inline-block pb1 -fw-500"
          aria-hidden="true"
          :for="`fieldValues[debts][${index}][type]`"
          :id="`other-debt-type-${index}-l`"
        >Value</label>
        <input
          type="text"
          class="form-control -fw"
          placeholder="Debt type"
          :id="`fieldValues[debts][${index}][type]`"
          :name="`fieldValues[debts][${index}][type]`"
          :aria-labelledby="`other-debt-type-${index}-l`"
          v-model="debt.type"
          required="required"
        >
        <p class="-on-error -danger -caption -fw-500 mt1"></p>
      </div>
      <div class="col col-4 pt2 pl2">
        <label
          class="inline-block pb1 -fw-500"
          :for="`masked-fieldValues-debt-amount-${index}`"
        >Amount</label>
        <masked-input
          class="form-control -fw"
          type="text"
          placeholder="$0.00"
          v-model="debt.amount"
          required="required"
          :id="`masked-fieldValues-debt-amount-${index}`"
          name="masked-fieldValues[debt-amount]"
          :mask="numberMask"
        />
        <input
          type="hidden"
          aria-hidden="true"
          class="d-none"
          :name="`fieldValues[debts][${index}][amount]`"
          :value="debt.amount.replace(/[^0-9.]/g, '')"
        >
        <p class="-on-error -danger -caption -fw-500 mt1"></p>
      </div>
    </div>
    <div class="col col-12">
      <button
        type="button"
        class="-k-btn btn-sm btn-info-outline mt2"
        v-if="multiple"
        @click="addDebt"
      >Add Debt</button>
      <button
        type="button"
        class="-k-btn btn-sm btn-info-outline mt2"
        v-if="multiple && debts.length > 1"
        @click="removeDebt"
      >Remove Debt</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import MaskedInput from 'vue-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { DebtTypesCollection } from '../../../../shared/enum/DebtTypes';

const DebtTypeKeys = DebtTypesCollection.map(a => a.key);

export default {
  components: { MaskedInput },
  props: {
    multiple: {
      type: Boolean,
      required: false,
      default: true,
    },
    intialDebts: {
      type: Array,
      required: false,
      default: () => [{ type: '', amount: '', typeSelected: '' }],
    },
  },
  data: function() {
    return {
      debts: this.intialDebts,
    };
  },
  methods: {
    addDebt() {
      this.debts.push({ type: '', amount: '', typeSelected: '' });
    },
    removeDebt() {
      this.debts.pop();
    },
    numberMask: createNumberMask({
      prefix: '$',
      // Limits the length before the decimal, not the amount
      allowDecimal: true,
      integerLimit: 6,
    }),
  },
  created() {
    this.DebtTypes = [...DebtTypesCollection, { key: 'other', value: 'Other' }];
  },
};
</script>

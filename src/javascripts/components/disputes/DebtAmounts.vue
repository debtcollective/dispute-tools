<template>
  <div>
    <div :class="`col col-${typeSelected === 'other' ? '4' : '8'} py2 pr2`">
      <label class="inline-block pb1 -fw-500" :for="typeSelected !== 'other' ? 'fieldValues[debt-type]' : 'debt-type[other]'" id="debt-type-l">Debt type</label>
      <div>
        <select class="-fw form-control" @input="handleTypeSelection" :value="typeSelected" :name="typeSelected !== 'other' ? 'fieldValues[debt-type]' : 'debt-type[other]'" aria-labelledby="debt-type-l" required="required">
          <option v-for="debtType in DebtTypes" :key="debtType.key" :value="debtType.key">{{debtType.value}}</option>
        </select>
      </div>
    </div>
    <div v-if="typeSelected === 'other'" class="col col-4 p2">
      <label class="inline-block pb1 -fw-500" aria-hidden="true" for="fieldValues[debt-type]" id="other-debt-type-l">Other debt type</label>
      <input type="text" class="form-control -fw" placeholder="..." name="fieldValues[debt-type]" aria-labelledby="other-debt-type-l" v-model="type" required="required" />
    </div>
    <div class="col col-4 py2 pl2">
      <label class="inline-block pb1 -fw-500">Amount</label>
      <input
        class="form-control -fw"
        type="number"
        min="0"
        step="0.01"
        placeholder="$0.00"
        v-model="amount"
        required="required"
        :name="`fieldValues[debt-amount]`"
      />
    </div>
  </div>
</template>

<script>
import { DebtTypesCollection } from '../../../../shared/enum/DebtTypes';

const DebtTypeKeys = DebtTypesCollection.map(a => a.key);

export default {
  props: {
    originalDebt: {
      type: Object,
      required: false,
      default: () => ({ type: '', amount: undefined }),
    },
  },
  data() {
    return {
      typeSelected: DebtTypeKeys.includes(this.originalDebt.type)
        ? this.originalDebt.type
        : 'other',
      type: this.originalDebt.type,
      amount: this.originalDebt.amount,
      cachedOther: '',
    };
  },
  methods: {
    handleTypeSelection({ target: { value } }) {
      if (this.typeSelected === 'other' && value !== 'other') {
        this.cachedOther = this.type;
        this.type = value;
      } else if (this.typeSelected !== 'other' && value === 'other') {
        this.type = this.cachedOther;
      }

      this.typeSelected = value;
    },
  },
  created() {
    this.DebtTypes = [...DebtTypesCollection, { key: 'other', value: 'Other' }];
  },
};
</script>

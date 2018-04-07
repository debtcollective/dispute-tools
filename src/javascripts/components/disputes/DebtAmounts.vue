<template>
  <div>
    <div v-for="(debt, i) in debts" :key="debt.type + i">
      <div class="col col-5 py2">
        <label class="inline-block pb1 -fw-500" :aria-hidden="i !== 0" :style="i !== 0 ? 'display: none' : ''">Debt type</label>
        <div class="-k-select">
          <select class="-fw" @input="e => debt.type = e.target.value" :value="debt.type" :name="`debts[${debt.type}]`">
            <option v-for="(v, k) in DebtTypes" :key="k" :value="k">{{v}}</option>
          </select>
        </div>
      </div>
      <div class="col col-5 p2">
        <label class="inline-block pb1 -fw-500" :aria-hidden="i !== 0" :style="i !== 0 ? 'display: none' : ''">Amount</label>
        <input
          class="-k-input -fw"
          type="number"
          min="0"
          step="0.01"
          placeholder="$0.00"
          v-model="debt.amount"
          @input="e => debt.amount = e.target.value"
          :name="`fieldValues[debts][${debt.type}][]`"
        />
      </div>
      <div class="btn-group">
        <div v-if="debts.length !== 1">
          <div :class="`col col-${i !== debts.length - 1 ? '2' : '1'} py2`">
            <label class="inline-block pb1 -fw-500" aria-hidden="true" :style="i !== 0 ? 'display: none' : ''">Remove</label>
            <button class="-k-btn btn-dark -fw-700" @click="() => removeRow(i)" style="width: 100%; border-radius: 0" type="button">-</button>
          </div>
        </div>
        <div v-if="i === debts.length - 1">
          <div :class="`col col-${i !== 0 && i === debts.length - 1 ? '1' : '2'} py2`">
            <label class="inline-block pb1 -fw-500" aria-hidden="true" :style="i !== 0 ? 'display: none' : ''">Add</label>
            <button class="-k-btn btn-primary -fw-700" @click="addRow" style="width: 100%; border-radius: 0" type="button">+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DebtTypes from '../../../../shared/enum/DebtTypes';

const defaultRow = () => ({ type: 'federalStudentLoanDebt', amount: undefined });

export default {
  props: {
    originalDebts: {
      type: Array,
      required: false,
      default: () => [defaultRow()],
    },
  },
  data() {
    return {
      debts: this.originalDebts,
    };
  },
  methods: {
    addRow(...args) {
      this.debts.push(defaultRow());
    },
    removeRow(i) {
      this.debts.splice(i, 1);
    },
  },
  created() {
    this.DebtTypes = DebtTypes;
  },
};
</script>

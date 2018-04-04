<template>
  <div class="pb3">
    <h3 class="pb3">Manage Admins</h3>
    <Multiselect
      v-model="assigned"
      :options="all"
      :multiple="true"
      track-by="id"
      :custom-label="o => o.name"
    />
    <button
      class="-fw -k-btn btn-primary -fw-700 mt2 mb2"
      @click="save"
      type="button"
    >
      Save
    </button>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { getAvailableAndAssignedAdmins, updateAdmins } from '../../../lib/api';
import RestAlert from '../../../components/RestAlert';

const alertsContainer = document.querySelector('.AlertWrapper');

export default {
  components: {
    Multiselect,
  },
  props: {
    initialDisputeId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      assigned: [],
      originalAssigned: [],
      all: [],
      alertsContainer,
      disputeId: this.initialDisputeId,
    };
  },
  created() {
    this.getAvailableAndAssignedAdmins();
  },
  methods: {
    save() {
      return updateAdmins(this.disputeId, this.assigned.map(a => a.externalId)).then(
        () =>
          new RestAlert({
            message: 'The list of administrators assigned has been updated.',
            type: 'success',
            containerRef: this.alertsContainer,
          }),
      );
    },
    setAssigned(assigned) {
      this.assigned = [...assigned];
    },
    setDisputeId(disputeId) {
      this.disputeId = disputeId;
      this.getAvailableAndAssignedAdmins();
    },
    getAvailableAndAssignedAdmins() {
      getAvailableAndAssignedAdmins(this.disputeId).then(({ assigned, available }) => {
        this.all = [...assigned, ...available];
        this.assigned = this.originalAssigned = [...assigned];
      });
    },
  },
};
</script>

<template>
  <div>
    <alert :alerts="alerts" />
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
        class="-fw -k-btn btn-primary -fw-600 mt2 mb2"
        @click="save"
        type="button"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { getAvailableAndAssignedAdmins, updateAdmins } from '../../../lib/api';
import RestAlert from '../../../components/RestAlert';
import Alert from '../../../components/Alerts.vue';

export default {
  components: {
    Multiselect,
    Alert,
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
      disputeId: this.initialDisputeId,
      alerts: [],
    };
  },
  created() {
    this.getAvailableAndAssignedAdmins();
  },
  methods: {
    save() {
      return updateAdmins(this.disputeId, this.assigned.map(a => a.externalId)).then(
        () =>
          (this.alerts = [
            {
              message: 'The list of administrators assigned has been updated.',
              type: 'success',
            },
          ]),
      );
    },
    setAssigned(assigned) {
      this.assigned = [...assigned];
    },
    setDisputeId(disputeId) {
      this.disputeId = disputeId;
      this.alerts = [];
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

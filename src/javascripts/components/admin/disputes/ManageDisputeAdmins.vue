<template>
  <div>
    <alert :alerts="alerts"/>
    <form class="pb3" @submit="e => e.preventDefault()">
      <h3 class="pb3">Manage Admins</h3>
      <Multiselect
        v-model="assigned"
        :options="all"
        :multiple="true"
        :disabled="!disputeThreadId"
        track-by="id"
        :custom-label="o => o.safeName"
      />
      <button
        class="-fw -k-btn btn-primary -fw-600 mt2 mb2"
        @click="save"
        :disabled="!disputeThreadId"
        type="button"
      >Save</button>
    </form>
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
  data() {
    return {
      assigned: [],
      originalAssigned: [],
      all: [],
      dispute: {},
      alerts: [],
    };
  },
  computed: {
    disputeThreadId: function() {
      if (this.dispute) {
        return this.dispute.disputeThreadId;
      }
    },
  },
  methods: {
    save() {
      if (!this.dispute) {
        return;
      }

      return updateAdmins(this.dispute.id, this.assigned.map(a => a.id)).then(
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
    setDispute(dispute) {
      this.dispute = dispute;
      this.alerts = [];
      this.getAvailableAndAssignedAdmins();
    },
    getAvailableAndAssignedAdmins() {
      getAvailableAndAssignedAdmins(this.dispute.id).then(({ assigned, available }) => {
        this.all = [...assigned, ...available];
        this.assigned = this.originalAssigned = [...assigned];
      });
    },
  },
};
</script>

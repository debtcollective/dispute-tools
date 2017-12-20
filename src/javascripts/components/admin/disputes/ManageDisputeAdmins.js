import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import { getAvailableAndAssignedAdmins, updateAdmins } from '../../../lib/api';
import RestAlert from '../../../components/RestAlert';

export default function (disputeId) {
  return new Vue({
    el: '#manage-assigned-admin-vue',
    components: {
      Multiselect,
    },
    data: {
      disputeId,
      assigned: [],
      originalAssigned: [],
      all: [],
      alertsContainer: document.querySelector('.AlertWrapper'),
    },
    methods: {
      save() {
        return updateAdmins(this.disputeId, this.assigned.map(a => a.id)).then(
          () =>
            new RestAlert({
              message: 'The list of administrators assigned has been updated.',
              type: 'success',
              containerRef: this.alertsContainer,
            })
        );
      },
      setAssigned(assigned) {
        this.assigned = [...assigned];
      },
      setDisputeId(nextDisputeId) {
        this.disputeId = nextDisputeId;
        getAvailableAndAssignedAdmins(this.disputeId).then(
          ({ assigned, available }) => {
            this.all = [...assigned, ...available];
            this.assigned = this.originalAssigned = [...assigned];
          }
        );
      },
    },
    created() {
      this.setDisputeId(this.disputeId); // initializes
    },
    render() {
      // eslint-disable-line
      return (
        <div class="pb3">
          <h3 class="pb3">Manage Admins</h3>
          <Multiselect
            value={this.assigned}
            on-input={this.setAssigned}
            options={this.all}
            multiple={true}
            track-by="id"
            custom-label={o => o.name}
          />
          <button
            class="-fw -k-btn btn-primary -fw-700 mt2 mb2"
            on-click={() => this.save()}
            type="button"
          >
            Save
          </button>
        </div>
      );
    },
  });
}

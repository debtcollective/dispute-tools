import Vue from 'vue';
import AdminEventsFormVue from '../../../../components/admin/campaigns/events/AdminEventsForm.vue';

window.NewAdminEventsFormController = class NewAdminEventsFormController {
  constructor({ campaign, gmapsKey }) {
    return new Vue({
      el: document.getElementById('new-event-vue'),
      data: {},
      render() {
        return <AdminEventsFormVue campaign={campaign} gmapsKey={gmapsKey} />;
      },
    });
  }
};

import Vue from 'vue';
import AdminEventsFormVue from '../../../../components/admin/campaigns/events/AdminEventsForm.vue';

window.EditAdminEventsFormController = class EditAdminEventsFormController {
  constructor({ campaign, event, gmapsKey }) {
    return new Vue({
      el: '#edit-event-vue',
      render() {
        return <AdminEventsFormVue campaign={campaign} event={event} gmapsKey={gmapsKey} />;
      },
    });
  }
};

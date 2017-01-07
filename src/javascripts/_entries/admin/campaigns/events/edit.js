import NodeSupport from '../../../../lib/widget/NodeSupport';
import Common from '../../../../components/Common';
import EditForm from '../../../../components/admin/campaigns/events/AdminEventsForm';

class ViewAdminEventsEdit extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      isAdmin: true,
    }));

    this.appendChild(new EditForm({
      name: 'EditForm',
      element: document.querySelector('[data-component-form]'),
    }));
  }
}

window.ViewAdminEventsEdit = ViewAdminEventsEdit;


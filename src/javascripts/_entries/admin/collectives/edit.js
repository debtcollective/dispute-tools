import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';
import EditForm from '../../../components/admin/collectives/edit/AdminCollectivesEditForm';

class ViewAdminCollectivesEdit extends NodeSupport {
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
      element: document.querySelector('[data-component-editform]'),
    }));
  }
}

window.ViewAdminCollectivesEdit = ViewAdminCollectivesEdit;

import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import UsersEditForm from '../../components/users/EditForm';

class ViewUsersEdit extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new UsersEditForm({
      name: 'UsersEditForm',
      element: document.querySelector('[data-component-usereditform]'),
    }));
  }
}

window.ViewUsersEdit = ViewUsersEdit;

import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import UsersEditForm from '../../components/users/EditForm';

class ViewUsersEdit extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    this.appendChild(new UsersEditForm({
      name: 'UsersEditForm',
      element: document.querySelector('[data-component-usereditform]'),
    }));
  }
}

window.ViewUsersEdit = ViewUsersEdit;

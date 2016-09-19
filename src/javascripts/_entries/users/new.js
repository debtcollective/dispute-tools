import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import UsersNewForm from '../../components/users/NewForm';

class ViewUsersNew extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new UsersNewForm({
      name: 'UsersNewForm',
      element: document.querySelector('[data-component-usernewform]'),
    }));
  }
}

window.ViewUsersNew = ViewUsersNew;

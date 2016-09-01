import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import UsersNewForm from '../../components/users/NewForm';

class ViewUsersNew extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    this.appendChild(new UsersNewForm({
      name: 'UsersNewForm',
      element: document.querySelector('[data-component-usernewform]'),
    }));
  }
}

window.ViewUsersNew = ViewUsersNew;

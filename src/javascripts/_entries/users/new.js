/* eslint-disable no-new */

import Header from '../../components/Header';
import NewForm from '../../components/users/NewForm';

class ViewUsersNew {
  constructor(config) {
    new Header({
      currentUser: config.currentUser,
      element: document.querySelector('[data-component-header]'),
    });

    new NewForm({
      element: document.querySelector('[data-component-usernewform]'),
    });
  }
}

window.ViewUsersNew = ViewUsersNew;

import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import SessionsChangePasswordForm from '../../components/sessions/ChangePasswordForm';

class ViewChangePassword extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    this.appendChild(new SessionsChangePasswordForm({
      name: 'SessionsChangePasswordForm',
      element: document.querySelector('[data-component-sessions-change-password]'),
    }));
  }
}

window.ViewChangePassword = ViewChangePassword;

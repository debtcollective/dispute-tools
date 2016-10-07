import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import SessionsChangePasswordForm from '../../components/sessions/ChangePasswordForm';

class ViewChangePassword extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new SessionsChangePasswordForm({
      name: 'SessionsChangePasswordForm',
      element: document.querySelector('[data-component-sessions-change-password]'),
    }));
  }
}

window.ViewChangePassword = ViewChangePassword;

import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import SessionsPasswordRecoverForm from '../../components/sessions/PasswordRecoverForm';

class ViewPasswordRecover extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new SessionsPasswordRecoverForm({
      name: 'SessionsPasswordRecoverForm',
      element: document.querySelector('[data-component-sessions-password-recover]'),
    }));
  }
}

window.ViewPasswordRecover = ViewPasswordRecover;

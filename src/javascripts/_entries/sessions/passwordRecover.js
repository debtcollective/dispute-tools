import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import SessionsPasswordRecoverForm from '../../components/sessions/PasswordRecoverForm';

class ViewPasswordRecover extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    this.appendChild(new SessionsPasswordRecoverForm({
      name: 'SessionsPasswordRecoverForm',
      element: document.querySelector('[data-component-sessions-password-recover]'),
    }));
  }
}

window.ViewPasswordRecover = ViewPasswordRecover;

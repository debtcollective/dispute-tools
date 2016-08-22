import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import SessionsNewForm from '../../components/sessions/NewForm';

class ViewSessionsNew extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    this.appendChild(new SessionsNewForm({
      name: 'SessionsNewForm',
      element: document.querySelector('[data-component-sessionsnewform]'),
    }));
  }
}

window.ViewSessionsNew = ViewSessionsNew;

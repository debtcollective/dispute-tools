import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import SessionsNewForm from '../../components/sessions/NewForm';

class ViewSessionsNew extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      }),
    );

    this.appendChild(
      new SessionsNewForm({
        name: 'SessionsNewForm',
        element: document.querySelector('[data-component-sessionsnewform]'),
      }),
    );
  }
}

window.ViewSessionsNew = ViewSessionsNew;

import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';

class ViewHomeIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));
  }
}

window.ViewHomeIndex = ViewHomeIndex;

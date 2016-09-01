import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';

class ViewHomeAbout extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });
  }
}

window.ViewHomeAbout = ViewHomeAbout;

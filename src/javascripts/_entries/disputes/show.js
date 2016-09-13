import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';

class ViewDisputesShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Header({
      name: 'Header',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
      element: document.querySelector('[data-component-header]'),
    }));

    // TODO:
    // - pass dispute data on config
    // - current state controller
    //  - create and add gather information form
    //    - create and add form widget
    //      - display the modal
    //    - create and add upload widget
    //  - add process controller
    //  - add signature controller
    //  - add follow up controller

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });
  }
}

window.ViewDisputesShow = ViewDisputesShow;


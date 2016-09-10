import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Header from '../../components/Header';
import Modal from '../../components/Modal';

class ViewDisputeToolsIndex extends NodeSupport {
  constructor(config) {
    super();

    this.disputeIds = config.disputeIds;

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

    this._bindEvents();
  }

  _bindEvents() {
    this.handlers = {};

    this.disputeIds.forEach(id => {
      this.appendChild(new Modal({
        name: `modal-${id}`,
        element: document.querySelector(`[data-component-modal="tool-modal-${id}"]`),
      }));

      this.handlers[id] = this._aboutClickHandler.bind(this, this[`modal-${id}`]);
      document.querySelector(`#tool-modal-toggler-${id}`)
        .addEventListener('click', this.handlers[id]);
    });
  }

  _aboutClickHandler(instance) {
    instance.activate();
  }
}

window.ViewDisputeToolsIndex = ViewDisputeToolsIndex;

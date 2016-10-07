import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Modal from '../../components/Modal';

class ViewDisputeToolsIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.disputeIds = config.disputeIds;

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
      document.getElementById(`tool-modal-toggler-${id}`)
        .addEventListener('click', this.handlers[id]);
    });
  }

  _aboutClickHandler(instance) {
    instance.activate();
  }
}

window.ViewDisputeToolsIndex = ViewDisputeToolsIndex;

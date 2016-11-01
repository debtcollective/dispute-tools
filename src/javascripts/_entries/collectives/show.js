import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Tabs from '../../components/Tabs';
import Modal from '../../components/Modal';

class ViewCollectivesShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new Tabs({
      name: 'Tabs',
      element: document.querySelector('[data-tabs-component]'),
      updateHash: true,
      defaultTab: 'panel-manifest',
    }));

    this.disputeIds = config.disputeIds;

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

window.ViewCollectivesShow = ViewCollectivesShow;

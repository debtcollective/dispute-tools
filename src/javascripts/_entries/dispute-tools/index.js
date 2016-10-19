import WebFont from 'webfontloader';
import Pisces from 'pisces';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Modal from '../../components/Modal';
import Glitch from '../../components/Glitch';

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

    this._bindEvents()._applyGlitch();
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

    this.pisces = new Pisces();
    this.whyFileDisputeAnchor = document.getElementById('why-file-dispute-anchor');
    this.whyFileDisputeSection = document.getElementById('why-file-dispute-section');

    this.whyFileDisputeAnchor.addEventListener('click', () => {
      this.pisces.scrollToElement(this.whyFileDisputeSection);
    });

    return this;
  }

  _applyGlitch() {
    const i1 = document.getElementById('glitch-image-1');
    const g1 = new Glitch();

    const i2 = document.getElementById('glitch-image-2');
    const g2 = new Glitch();

    const i3 = document.getElementById('glitch-image-3');
    const g3 = new Glitch();

    g1.load(i1, () => {
      g1.canvas.className = 'sm-hide xs-hide';
      g1.render(i1.parentElement);
    });

    g2.load(i2, () => {
      g2.render(i2.parentElement);
    });

    g3.load(i3, () => {
      g3.render(i3.parentElement);
    });

    Glitch.run();
  }

  _aboutClickHandler(instance) {
    instance.activate();
  }
}

window.ViewDisputeToolsIndex = ViewDisputeToolsIndex;

import Pisces from 'pisces';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Modal from '../../components/Modal';
import Glitch from '../../components/Glitch';

class ViewDisputeToolsIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      }),
    );

    this.disputeIds = config.disputeIds;

    this.DTRlink = document.getElementById('defense-to-repayment-link');
    this.DTRstayButton = document.getElementById('stay-button');
    this.DTRcontinueButton = document.getElementById('continue-button');

    this._bindEvents()
      ._bindScrollTo()
      ._applyGlitch();
  }

  _bindEvents() {
    this.handlers = {};

    this.disputeIds.forEach(id => {
      this.appendChild(
        new Modal({
          name: `modal-${id}`,
          element: document.querySelector(`[data-component-modal="tool-modal-${id}"]`),
        }),
      );

      this.handlers[id] = this._aboutClickHandler.bind(this, this[`modal-${id}`]);
      document
        .getElementById(`tool-modal-toggler-${id}`)
        .addEventListener('click', this.handlers[id]);
    });

    this.appendChild(
      new Modal({
        name: 'DTRmodal',
        element: document.querySelector(
          '[data-component-modal="defense-to-repayment-link-warning"]',
        ),
      }),
    );

    this.DTRlink.addEventListener('click', e => {
      e.preventDefault();
      this.DTRmodal.activate();
    });

    this.DTRstayButton.addEventListener('click', e => {
      e.preventDefault();
      this.DTRmodal.deactivate();
    });

    this.DTRcontinueButton.addEventListener('click', () => this.DTRmodal.deactivate());

    return this;
  }

  _bindScrollTo() {
    this.pisces = new Pisces();

    this.whyFileDisputeAnchor = document.getElementById('why-file-dispute-anchor');
    this.whyFileDisputeSection = document.getElementById('why-file-dispute');
    this.whyFileDisputeAnchor.addEventListener('click', () => {
      const y = this.whyFileDisputeSection.offsetTop;
      this.pisces.scrollToPosition({ y });
    });

    this.toolsAnchor = document.getElementById('tools-anchor');
    this.toolsSection = document.getElementById('tools');
    this.toolsAnchor.addEventListener('click', () => {
      const y = this.toolsSection.offsetTop;
      this.pisces.scrollToPosition({ y });
    });

    return this;
  }

  _applyGlitch() {
    if (!Glitch._supported) {
      return;
    }

    const i1 = document.getElementById('glitch-image-1');
    const g1 = new Glitch();

    const i2 = document.getElementById('glitch-image-2');
    const g2 = new Glitch();

    const i3 = document.getElementById('glitch-image-3');
    const g3 = new Glitch();

    g1.load(i1, () => {
      i1.style.opacity = 0;
      g1.canvas.className = 'sm-hide xs-hide';
      g1.render(i1.parentElement);
    });

    g2.load(i2, () => {
      i2.style.opacity = 0;
      g2.render(i2.parentElement);
    });

    g3.load(i3, () => {
      i3.style.opacity = 0;
      g3.render(i3.parentElement);
    });

    Glitch.run();
  }

  _aboutClickHandler(instance) {
    instance.activate();
  }
}

window.ViewDisputeToolsIndex = ViewDisputeToolsIndex;

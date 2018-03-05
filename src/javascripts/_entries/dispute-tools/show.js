import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Modal from '../../components/Modal';

class ViewDisputeToolsShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      }),
    );

    this._bindEvents(config);
  }

  _bindEvents(config) {
    this.handlers = {};

    let _option;
    Object.keys(config.options).forEach(option => {
      _option = config.options[option];

      if (_option.more) {
        this.appendChild(
          new Modal({
            name: `common-cases-${option}`,
            element: document.querySelector(
              `[data-component-modal="common-cases-modal-${option}"]`,
            ),
          }),
        );

        this.handlers[option] = this._aboutClickHandler.bind(this, this[`common-cases-${option}`]);
        document
          .getElementById(`common-cases-toggler-${option}`)
          .addEventListener('click', this.handlers[option]);
      }
    });
  }

  _aboutClickHandler(instance, ev) {
    ev.preventDefault();
    instance.activate();
  }
}

window.ViewDisputeToolsShow = ViewDisputeToolsShow;

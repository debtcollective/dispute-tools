import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import DisputesController from '../../components/disputes/Controller';

class ViewDisputesShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));

    this.appendChild(new DisputesController({
      name: 'DisputesController',
      dispute: config.dispute,
      currentStep: config.currentStep,
    }));
  }
}

window.ViewDisputesShow = ViewDisputesShow;


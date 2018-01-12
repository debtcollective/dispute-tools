import WebFont from 'webfontloader';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import DisputesController from '../../components/disputes/Controller';

class ViewDisputesShow extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
      }),
    );

    this.appendChild(
      new DisputesController({
        name: 'DisputesController',
        dispute: config.dispute,
        currentStep: config.currentStep,
      }),
    );

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });
  }
}

window.ViewDisputesShow = ViewDisputesShow;

import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';
import * as informationForm from '../../../components/disputes/InformationForm';

const { mountDebtAmounts, default: DisputesInformationForm } = informationForm;

class ViewAdminDisputesShow extends NodeSupport {
  constructor(config) {
    super(config);

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
        isAdmin: true,
      }),
    );

    this.appendChild(
      new DisputesInformationForm({
        name: 'DisputesInformationForm',
        dispute: config.dispute,
        element: document.querySelector('[data-component-form="dispute-personal-information"]'),
      }),
    );

    this.debtAmounts = mountDebtAmounts(config);
  }
}

window.ViewAdminDisputesShow = ViewAdminDisputesShow;

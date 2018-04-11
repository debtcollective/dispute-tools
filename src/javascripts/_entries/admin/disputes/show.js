import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';
import { mountDebtAmounts } from '../../../components/disputes/InformationForm';

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

    this.debtAmounts = mountDebtAmounts(config);
  }
}

window.ViewAdminDisputesShow = ViewAdminDisputesShow;

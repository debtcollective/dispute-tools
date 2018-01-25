import NodeSupport from '../../../lib/widget/NodeSupport';
import Common from '../../../components/Common';
import Controller from '../../../components/admin/disputes/AdminDisputesIndexController';

class ViewAdminDisputesIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(
      new Common({
        name: 'Common',
        currentUser: config.currentUser,
        currentURL: config.currentURL,
        isAdmin: true,
      }),
    );

    this.appendChild(
      new Controller({
        name: 'AdminDisputesIndexController',
        disputes: config.disputes,
      }),
    );
  }
}

window.ViewAdminDisputesIndex = ViewAdminDisputesIndex;

import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Tabs from '../../components/Tabs';

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
  }
}

window.ViewCollectivesShow = ViewCollectivesShow;


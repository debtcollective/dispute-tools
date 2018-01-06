import Checkit from 'checkit';
import NodeSupport from './lib/widget/NodeSupport';
import Common from './components/Common';

require('./_vendor/polyfills');

class ViewDefault extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));
  }
}

window.ViewDefault = ViewDefault;


window.Checkit = Checkit;

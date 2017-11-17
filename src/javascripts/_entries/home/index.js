import Pisces from 'pisces';
import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Glitch from '../../components/Glitch';

class ViewHomeIndex extends NodeSupport {
  constructor(config) {
    super();

    this.appendChild(new Common({
      name: 'Common',
      currentUser: config.currentUser,
      currentURL: config.currentURL,
    }));
  }
}

window.ViewHomeIndex = ViewHomeIndex;

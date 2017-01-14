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

    this._applyGlitch();
  }

  _applyGlitch() {
    if (!Glitch._supported) {
      return;
    }

    const i = document.getElementById('glitch-image');
    const g = new Glitch();

    g.load(i, () => {
      i.style.opacity = 0;
      g.render(i.parentElement);
    });

    Glitch.run();
  }
}

window.ViewHomeIndex = ViewHomeIndex;

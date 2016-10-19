import WebFont from 'webfontloader';
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

    WebFont.load({
      google: {
        families: ['Space Mono'],
      },
    });

    this._applyGlitch();
  }

  _applyGlitch() {
    const i1 = document.getElementById('glitch-image-1');
    const g1 = new Glitch();

    const i2 = document.getElementById('glitch-image-2');
    const g2 = new Glitch();

    g1.load(i1, () => {
      i1.style.opacity = 0;
      g1.canvas.className = 'sm-hide xs-hide';
      g1.render(i1.parentElement);
    });

    g2.load(i2, () => {
      i2.style.opacity = 0;
      g2.canvas.style.opacity = '0.5';
      g2.render(i2.parentElement, i2.nextSibling);
    });

    Glitch.run();
  }
}

window.ViewHomeIndex = ViewHomeIndex;

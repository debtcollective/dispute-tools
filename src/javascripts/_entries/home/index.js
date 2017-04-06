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

    this._bindScrollTo();
  }

  _bindScrollTo() {
    this.pisces = new Pisces();

    this.bottomAnchor = document.getElementById('home-bottom-anchor');
    this.bottomSection = document.getElementById('home-bottom-section');
    this.bottomAnchor.addEventListener('click', () => {
      const y = this.bottomSection.offsetTop - 60;
      this.pisces.scrollToPosition({ y });
    });

    return this;
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

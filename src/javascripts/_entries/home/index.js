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

    const image = document.getElementById('glitch-image-1');
    const glitch = new Glitch();

    glitch.load(image, () => {
      image.style.opacity = 0;
      glitch.canvas.style.opacity = '0.5';
      glitch.render(image.parentElement, image.nextSibling);
      Glitch.run();
    });
  }
}

window.ViewHomeIndex = ViewHomeIndex;

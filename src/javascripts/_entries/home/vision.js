import NodeSupport from '../../lib/widget/NodeSupport';
/* global Checkit */

class VisionNav extends NodeSupport {
  constructor() {
    super();
    const self = this;
    self._show(window.location.hash);
    const els = document.querySelectorAll('.navlink');
    els.forEach(el => {
      el.onclick = self._readMore(el);
    });
    const videos = 8;
    window.onscroll = () => {
      const val = Math.round(window.pageYOffset % videos);
      const el = document.querySelector(`#video-${val}`);
      if (el) el.classList.remove('hide');
    };
  }
  _show(hash) {
    window.location.hash = hash;
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(`modal-${id}`);
    if (el) {
      el.classList.remove('hide');
    }
  }
  _hideAll() {
    document.querySelectorAll('.navlink').forEach(el => {
      el.classList.remove('choice');
    });
    document.querySelectorAll('.link').forEach(el => {
      el.classList.add('hide');
    });
  }
  _readMore(el) {
    const self = this;
    return () => {
      self._hideAll();
      el.innerHTML = 'Hide';
      self._show(el.getAttribute('data-link'));
      el.onclick = () => {
        el.onclick = self._readMore(el);
        el.innerHTML = 'Read more';
        el.parentElement.children[3].classList.add('hide');
        // el.parentElement.classList.add('hide')
      };
    };
  }
}

window.VisionNav = VisionNav;

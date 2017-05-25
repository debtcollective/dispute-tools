import NodeSupport from '../../lib/widget/NodeSupport';
import Common from '../../components/Common';
import Button from '../../components/Button';
/* global Checkit */

class VisionNav extends NodeSupport {
  constructor(config) {
    super();
    var self = this
    // this.backButton = document.createElement('a')
    // this.backButton.classList.add('close-button')
    // this.backButton.classList.add('pt4')
    // this.backButton.setAttribute('href', '#')
    // this.backButton.innerHTML = 'see all policy positions'
    // this.backButton.onclick = this._back.bind(this)

    self._show(window.location.hash)
    var els = document.querySelectorAll('.navlink')
    els.forEach(function (el) {
      el.onclick = self._readMore(el)
    })
  }
  _show(hash) {
    window.location.hash = hash
    if (!hash) return
    var id = hash.replace('#', '')
    var el = document.getElementById('modal-' + id)
    if (el) {
      el.classList.remove('hide')
    }
  }
  _hideAll() {
    var els = document.querySelectorAll('.navlink')
    els.forEach(function (el) {
      el.classList.remove('choice')
    })
    var els = document.querySelectorAll('.link')
    els.forEach(function (el) {
      el.classList.add('hide')
    })
  }
  _readMore (el)  {
    var self = this
    console.log('generated function')
    return function (e) {
      console.log('calling read more!')
      self._hideAll()
      el.innerHTML = 'Hide'
      self._show(el.getAttribute('data-link'))
      el.onclick = function hide (e) {
        el.onclick = self._readMore(el)
        el.innerHTML = 'Read more'
        el.parentElement.children[3].classList.add('hide')
        // el.parentElement.classList.add('hide')
      }
    }
  }
}

window.VisionNav = VisionNav;

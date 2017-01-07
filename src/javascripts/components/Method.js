import { req } from '../lib/api';

export default class Method {
  static init() {
    Array.prototype.slice.call(document.querySelectorAll('[data-method]')).forEach((node) => {
      node.addEventListener('click', (e) => {
        e.preventDefault();

        req({
          url: e.target.href,
          method: e.target.dataset.method,
        }, () => {
          document.location.reload();
        });
      });
    });
  }
}

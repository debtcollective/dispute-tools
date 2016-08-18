import Widget from './';

export default function mix(...modules) {
  let desc;
  let _Mix = class {};

  // if extending Widget
  if (modules.filter((module) => { return module.name === 'Widget'; }).length) {
    modules.splice(modules.indexOf(Widget), 1);
    _Mix = class extends Widget {};
  }

  modules.map(module => {
    return Object.getOwnPropertyNames(module.prototype).map(key => {
      if (key !== 'constructor' && key !== 'name') {
        desc = Object.getOwnPropertyDescriptor(module.prototype, key);
        Object.defineProperty(_Mix.prototype, key, desc);
      }
      return undefined;
    });
  });

  return _Mix;
}

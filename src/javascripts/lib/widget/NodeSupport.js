export default class NodeSupport {
  appendChild (child) {
    if (child.parent) {
      child.parent.removeChild(child);
    }

    if (!this.hasOwnProperty('children')) {
      this.children = [];
    }

    this.children.push(child);
    if (child.name) {
      this[child.name] = child;
    }
    child.setParent(this);
    return child;
  }

  removeChild(child) {
    let position = this.children.indexOf(child);

    if (position !== -1) {
      this.children.splice(position, 1);
      delete this[child.name];
      child.parent = null;
    }

    return child;
  }

  setParent(parent) {
    this.parent = parent;
    return this;
  }
}

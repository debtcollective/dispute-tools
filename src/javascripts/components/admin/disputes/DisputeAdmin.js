import Widget from '../../../lib/widget';

export default class DisputeAdmin extends Widget {
  template() {
    const margin = this.side === 'available' ? 'mr1' : 'ml1';
    const input = `<input class="${margin}"
        type="checkbox"
        id="${this.id}"
        value="${this.id}"
        name="${this.name}"></input>`;

    return `
      <label class="-ff-sec block pb2">
        ${this.side === 'available' ? input + this.name : this.name + input}
      </label>
    `;
  }
}

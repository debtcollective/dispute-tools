import Widget from '../../lib/widget';

export default class StatusItem extends Widget {
  static get TDCAvatar() {
    return '<div class="StatusItem-TDC-placeholder"></div>';
  }

  template(data) {
    const userUpdate = data.status.status === 'User Update';
    const date = new Date(data.status.createdAt).toDateString();
    const statusClass = `-status-${data.status.status.toLowerCase().replace(/\W/g, '-')}`;

    let name = 'The Debt Collective';
    let nameClass = '-primary';
    // TODO Use Discourse provided profile image
    // let avatar = this.constructor.TDCAvatar;

    if (userUpdate) {
      name = data.dispute.user.fullname;
      nameClass = '';
      // avatar = this._getUserAvatar(data.dispute.user.account);
    }

    return `
      <div class='StatusItem py2 clearfix'>
        <div class="StatusItem-Avatar left">

        </div>
        <div class="StatusItem-Text">
          <div class="clearfix">
            <div class="left">
              <p class="-fw-700 ${nameClass}">
                ${name}
              </p>
              <div class="-caption -neutral-mid">
                <svg class="inline-block" width="13" height="11">
                  <use xlink:href="#svg-reply"></use>
                </svg>
                <div class="ml1 inline-block -fw-700">
                  ${date}
                </div>
              </div>
            </div>
            <div class="right">
              <p class="-caption -fw-700 -ttu ${statusClass}">
                ${data.status.status}
              </p>
            </div>
          </div>
          <div class="-fw-500">${data.status.comment || ''}</div>
          <div class="StatusItem-Note p2 mt1">${data.status.note || ''}</div>
        </div>
      </div>
    `;
  }

  _getUserAvatar(user) {
    return `<img class="block -fw" src=${user.imageURL} />`;
  }
}

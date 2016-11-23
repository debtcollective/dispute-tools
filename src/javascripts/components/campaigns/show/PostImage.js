/* eslint-disable no-console, no-unused-vars, max-len */
import Widget from '../../../lib/widget';

export default class PostImage extends Widget {
  constructor(config) {
    super(config);
    console.log('Image');
  }

  template(data) {
    return `
      <div class="Campaign_FeedItem -bg-white p2">
        <div class="flex relative">
          ${this._tag(data.topic)}
          <div>
            ${this._getUserAvatar(data.user.account)}
          </div>
          <div class="flex-auto pl2">
            <p class="-fw-500">${data.user.account.fullname}</p>
            <p class="pb2 -caption -neutral-dark">${new Date(data.createdAt).toDateString()}</p>
            <p class="-fw-500">${data.data.text}</p>
            <img src='${data.imageURL}' class='fit' />
            <div class="right-align">
              <button class="btn-clear mx1">
                <svg class="inline-block align-middle" width="20" height="20">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-comment"></use>
                </svg>
                <span class="inline-block align-middle pl1">${data.comments.length}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _tag(topic) {
    if (!topic) {
      return '';
    }

    return `<span class="Tag -bg-accent -caption -ttu -fw-700 absolute top-0 right-0">${topic.title}</span>`;
  }

  _getUserAvatar(account) {
    const url = account.imageURL || '/images/profile/placeholder-small.png';
    return `<img src="${url}" alt="${account.fullname}" width="50" height="50"/>`;
  }
}

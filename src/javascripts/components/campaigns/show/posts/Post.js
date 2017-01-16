import Widget from '../../../../lib/widget';
import CommentsManager from './comments/Manager';

export default class Post extends Widget {
  constructor(config) {
    super(config);

    if (this.userBelongsToCampaign) {
      this.appendChild(new CommentsManager({
        name: 'CommentsManager',
        data: this.data,
        element: this.element,
        toogleButtonCotainer: this.element.querySelector('[data-campaing-post-container]'),
      }));
    }
  }

  getTopicHTMLString(topic) {
    if (!topic) {
      return '';
    }

    return `<span class='Post_Topic -bg-accent -caption -ttu -fw-700'>${topic.title}</span>`;
  }

  getAvatarHTMLString(account, size = 50) {
    const url = account.image.urls.smallRedSquare || '/images/profile/placeholder-small.png';
    return `<img src='${url}' alt='${account.fullname}' width='${size}' height='${size}'/>`;
  }
}

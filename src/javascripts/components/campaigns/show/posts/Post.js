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

  getCaptionHTMLString(data) {
    let result = `
      <p class="pb2">
        <time datetime='${data.createdAt}' class='-caption -neutral-dark'>
          ${new Date(data.createdAt).toDateString()}
        </time>
      `;

    if (data.public) {
      result += `
        <span class='inline-block align-top px1'>•</span>
        <span class='inline-block align-middle -caption -neutral-mid'>
          <svg class='inline-block align-top' width='13' height='19'>
            <use xlink:href="#svg-website"></use>
          </svg>
          <span>Public</span>
        </span>
      `;
    }

    result += '</p>';

    return result;
  }
}

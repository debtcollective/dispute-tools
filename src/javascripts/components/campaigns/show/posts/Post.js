import moment from 'moment';
import Widget from '../../../../lib/widget';
import CommentsManager from './comments/Manager';

export default class Post extends Widget {
  constructor(config) {
    super(config);

    if (this.userBelongsToCampaign) {
      this.appendChild(
        new CommentsManager({
          name: 'CommentsManager',
          data: this.data,
          element: this.element,
          toogleButtonCotainer: this.element.querySelector(
            '[data-campaing-post-container]',
          ),
        }),
      );
    }
  }

  getTopicHTMLString(topic) {
    if (!topic) {
      return '';
    }

    return `<span class='Post_Topic -bg-accent -caption -ttu -fw-700'>${
      topic.title
    }</span>`;
  }

  getAvatarHTMLString(account, size = 50) {
    const url =
      account.image.urls.smallRedSquare ||
      '/images/profile/placeholder-small.png';
    return `<img src='${url}' alt='${
      account.fullname
    }' width='${size}' height='${size}'/>`;
  }

  getCaptionHTMLString(data) {
    const { campaign } = data;
    let result = `
    <form action="${this.deletePostActionUrl}" method="post"
      onsubmit="return confirm('Are you sure you want to delete this post?')"
    >
      <input type="hidden" name="_csrf" value="${this.csrfToken}">
      <input type="hidden" name="_method" value="delete">
      <div class='Post_Header'>
        <p class='-fw-500'>
          ${data.user.account.fullname}
          <time datetime='${data.createdAt}' class='-fw-400'>
          · ${moment(data.updatedAt).fromNow()}
          </time>
      `;

    if (data.public) {
      result += `
        <span class='inline-block align-top px1'>·</span>
        <span class='inline-block align-middle -caption -neutral-mid'>
          <svg class='inline-block align-top' width='13' height='19'>
            <use xlink:href="#svg-website"></use>
          </svg>
          <span>Public</span>
        </span>
      `;
    }

    if (this.userIsPostAuthor || this.userIsCollectiveManager) {
      result += `
        <button type='submit' class='inline-block align-middle -danger -caption'
          style='border:0;background:inherit'
        >
          <svg class='inline-block align-top' width='13' height='19'>
            <use xlink:href="#svg-trash"></use>
          </svg>
          <span>Delete</span>
        </button>
      `;
    }

    result += '</p></div>';

    if (campaign) {
      result += `
      <p class="pb2 Post_CampaignName">
        in
        <a href='/campaigns/${campaign.id}'>
        ${campaign.title}
        </a>
      </p>
      `;
    }

    result += '</form>';

    return result;
  }
}

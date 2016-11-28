import Post from './Post';
import API from '../../../../lib/api';
import Button from '../../../../components/Button';
import currentUser from '../../../../lib/currentUser';

export default class PostPoll extends Post {
  constructor(config) {
    super(config);

    if (this._userAlreadyVoted(this.data)) {
      return;
    }

    this.mainElement = this.element.querySelector('[data-main-content]');
    this.optionsElements = this.element.querySelectorAll('[type="radio"]');
    this.optionsElements = Array.prototype.slice.call(this.optionsElements);
    this.appendChild(new Button({
      name: 'voteButton',
      element: this.element.querySelector('[data-vote-btn]'),
    })).disable();

    this._bindPrivateEvents();
  }

  template(data) {
    return `
      <div class="Campaign_FeedItem mb1">
        <div class='-bg-white p2'>
          <div class="flex relative">
            ${this._tag(data.topic)}
            <div>
              ${this._getPostAuthorAvatar(data.user.account)}
            </div>
            <div class="flex-auto pl2">
              <p class="-fw-500">${data.user.account.fullname}</p>
              <p class="pb2 -caption -neutral-dark">${new Date(data.createdAt).toDateString()}</p>
              <p class="pb3">${data.data.title}</p>
              <div data-main-content>
                ${this._renderMainContent(data)}
              </div>
              <div class="right-align">
                <button class="Post_ToggleCommentsBtn btn-clear"
                  aria-expanded="false"
                  aria-controls="comments-${data.id}"
                >
                  <svg class="inline-block align-middle" width="20" height="20"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-comment"></use></svg>
                  <span class="inline-block align-middle pl1">${data.comments.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class='Campaign_FeedItemComments -bg-white'
          id='comments-${data.id}'
          aria-expanded="false"
        >
          ${data.comments.map(comment => this._printComment(comment)).join('')}
        </div>
      </div>
    `;
  }

  _renderMainContent(data) {
    if (this._userAlreadyVoted(data)) {
      const totalVotes = data.data.votes.reduce((p, c) => p.concat(c), []).length;
      const mostVoted = data.data.votes.reduce((a, b) => (a.length > b.length ? a : b), []);
      const mostVotedIndex = data.data.votes.indexOf(mostVoted);

      return `
        <div class='pb2'>
          ${data.data.options.map((option, index) => this._x(option, index, data, totalVotes, mostVotedIndex)).join('')}
        </div>
      `;
    }

    return `
      ${data.data.options.map(option => this._label(option, data)).join('')}
      <button class='-k-btn btn-dark -sm -fw-700 mt2' data-vote-btn>Vote</button>
    `;
  }

  _x(label, index, data, totalVotes, mostVotedIndex) {
    let percentage = (data.data.votes[index].length * 100) / totalVotes;
    let color = '-bg-neutral-dark';

    percentage = percentage ? `${percentage}%` : '10px';

    if (index === mostVotedIndex) {
      color = '-bg-primary';
    }

    return `
      <div class='flex pb2'>
        <div class='mr1' style='width: 30px; height: 30px;'>
          ${(function itsMe() {
            if (data.data.votes[index].indexOf(currentUser.get('id')) >= 0) {
              const url = currentUser.getImage('smallRedSquare');
              return `<img src="${url}" width="25" height="25"/>`;
            }
            return '';
          }())}
        </div>
        <div class='flex-auto'>
          <div class='pb1' style='line-height: 1;'>
            <span>${label}</span>
            <span class='-neutral-mid'>(${data.data.votes[index].length})</span>
          </div>
          <div>
            <div class='PostPoll_result-bar ${color}' style='width: ${percentage};'></div>
          </div>
        </div>
      </div>
    `;
  }

  _userAlreadyVoted(post) {
    let foundUser = false;

    for (let i = 0; i < post.data.votes.length; i++) {
      const currentItem = post.data.votes[i];

      for (let j = 0; j < currentItem.length; j++) {
        if (currentItem[j] === currentUser.get('id')) {
          foundUser = true;
          break;
        }
      }
    }

    return foundUser;
  }

  _bindPrivateEvents() {
    this._handleOptionChangeRef = this._handleOptionChange.bind(this);
    this.element.addEventListener('change', this._handleOptionChangeRef);

    this._handleVoteClickRef = this._handleVoteClick.bind(this);
    this.voteButton.element.addEventListener('click', this._handleVoteClickRef);

    return this;
  }

  _handleOptionChange(ev) {
    if (ev.target.tagName !== 'INPUT') {
      return;
    }

    if (this.voteButton.disabled) {
      this.voteButton.enable();
    }
  }

  _handleVoteClick() {
    let selectedOption = this.optionsElements.filter(option => option.checked);
    let index = 0;

    if (!selectedOption.length) {
      return;
    }

    this.voteButton.disable();

    selectedOption = selectedOption[0];
    index = this.optionsElements.indexOf(selectedOption);

    if (index >= 0) {
      API.campaignPostVote({
        campaignId: this.data.campaignId,
        postId: this.data.id,
        body: { index },
      }, (err, res) => {
        if (err) {
          return this.voteButton.enable();
        }

        this.mainElement.innerHTML = this._renderMainContent(res.body);
        return null;
      });
    }
  }

  _label(label, post) {
    return `
      <label class="block pb1">
        <input type="radio" name="${post.id}">
        <span class="pl1">${label}</span>
      </label>
    `;
  }
}

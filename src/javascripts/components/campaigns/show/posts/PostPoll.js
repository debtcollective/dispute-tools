import Post from './Post';
import { campaignPostVote } from '../../../../lib/api';
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
    this.appendChild(
      new Button({
        name: 'voteButton',
        element: this.element.querySelector('[data-vote-btn]'),
      }),
    ).disable();

    this._bindPrivateEvents();
  }

  template(data) {
    return `
      <div class='Campaign_FeedItem'>
        <div data-campaing-post-container class='-bg-white p2'>
          <div class='flex relative'>
            ${this.getTopicHTMLString(data.topic)}
            <div>
              ${this.getAvatarHTMLString(data.user.account)}
            </div>
            <div class='flex-auto pl2'>
              <p class='-fw-500'>${data.user.account.fullname}</p>
              ${this.getCaptionHTMLString(data)}
              <p class='Campaign_FeedItemText pb3'>${data.data.title}</p>
              <div data-main-content>
                ${this._renderPollContent(data)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderPollContent(data) {
    if (this._userAlreadyVoted(data)) {
      const totalVotes = data.data.votes.reduce((p, c) => p.concat(c), [])
        .length;
      const mostVoted = data.data.votes.reduce(
        (a, b) => (a.length > b.length ? a : b),
        [],
      );
      const mostVotedIndex = data.data.votes.indexOf(mostVoted);

      return `
        <div class='pb2'>
          ${data.data.options
            .map((option, index) =>
              this._renderPollResults(
                option,
                index,
                data,
                totalVotes,
                mostVotedIndex,
              ),
            )
            .join('')}
        </div>
      `;
    }

    if (currentUser.get('id')) {
      return `
        ${data.data.options
          .map(option => this._renderPollOption(option, data))
          .join('')}
        <button class='-k-btn btn-dark -sm -fw-700 mt2' data-vote-btn>Vote</button>
      `;
    }

    return `
      ${data.data.options
        .map(option => this._renderPollOption(option, data))
        .join('')}
    `;
  }

  _renderPollResults(label, index, data, totalVotes, mostVotedIndex) {
    let percentage = data.data.votes[index].length * 100 / totalVotes;
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
              const avatarUrl = currentUser.getImage('smallRedSquare');
              return `<img src='${avatarUrl}' width='25' height='25'/>`;
            }
            return '';
          })()}
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

  _renderPollOption(label, post) {
    return `
      <label class="block pb1">
        <input type="radio" name="${post.id}">
        <span class="pl1">${label}</span>
      </label>
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

    this.voteButton.disable().updateText('Saving...');

    selectedOption = selectedOption[0];
    index = this.optionsElements.indexOf(selectedOption);

    if (index >= 0) {
      campaignPostVote(
        {
          campaignId: this.data.campaignId,
          postId: this.data.id,
          body: { index },
        },
        (err, res) => {
          if (err) {
            return this.voteButton.enable().restoreText();
          }

          this.mainElement.innerHTML = this._renderPollContent(res.body);
          return null;
        },
      );
    }
  }
}

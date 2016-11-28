/**
 * This Widget is in charge of handling the post’s comments functionality:
 * - display the comments (toggle) button
 * - expand/collapse the comment list
 * - handle the creation of new comments
 */

import Pisces from 'pisces';
import Widget from '../../../../../lib/widget';
import ToggleCommentsButton from './ToggleCommentsButton';
import CommentList from './CommentList';
import NewComment from './NewComment';

export default class CommentsManager extends Widget {
  constructor(config) {
    super(config);

    this.expandedComments = false;
    this.totalComments = this.data.comments.length;

    this.piscesComment = new Pisces();

    this.appendChild(new ToggleCommentsButton({
      name: 'ToggleCommentsButton',
      data: this.data,
    })).render(this.toogleButtonCotainer);

    this.appendChild(new CommentList({
      name: 'CommentList',
      data: this.data,
    })).render(this.element);

    this.appendChild(new NewComment({
      name: 'NewComment',
      data: this.data,
    })).render(this.CommentList.element);

    this._bindEvents();
  }

  _bindEvents() {
    this._handleToogleComments = this._handleToogleComments.bind(this);
    this.ToggleCommentsButton.element.addEventListener('click', this._handleToogleComments);

    this._handleNewCreatedComment = this._handleNewCreatedComment.bind(this);
    this.NewComment.bind('newComment', this._handleNewCreatedComment);

    return this;
  }

  _handleToogleComments() {
    this.expandedComments = !this.expandedComments;

    this.ToggleCommentsButton.element.setAttribute('aria-expanded', this.expandedComments);
    this.CommentList.element.setAttribute('aria-expanded', this.expandedComments);

    this.NewComment[this.expandedComments ? 'activate' : 'deactivate']();
  }

  /*
   * Appends a new comment to the list and scroll up so the user can see its
   * new comment have been created.
   * @listens @module:NewComment~event:newComment
   */
  _handleNewCreatedComment(ev) {
    this.CommentList.appendComment(ev.res.body);

    let y = this.element.getBoundingClientRect().top;
    y = (y >= 0) ? `+${y}` : y.toString();

    this.piscesComment.scrollToPosition({ y }, {
      onComplete: () => {
        this.ToggleCommentsButton.updateLabel(++this.totalComments);
      },
    });
  }
}

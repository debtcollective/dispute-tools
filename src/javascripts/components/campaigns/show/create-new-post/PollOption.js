import Widget from '../../../../lib/widget';

export default class PollOption extends Widget {
  template() {
    return `
      <div class='Poll_create-option -bg-accent mxn2'>
        <div class='-input-group-icon'>
          <svg width='10' height='10'>
            <use xlink:href='#svg-plus'></use>
          </svg>
          <input class='-k-input -no-border -transparent -fw'
            name='pollOption'
            placeholder='Write an option...'/>
        </div>
      </div>
    `;
  }
}

import Widget from '../../lib/widget';

export default class DisputeFormView extends Widget {
  template(data) {
    const keys = Object.keys(data.form);

    return `
      <div>
        <h4>${data.name}</h4>
        <table class='FormView'>
          <tbody>
          ${keys
            .map(
              key => `<tr>
              <td>
                ${key}: ${data.form[key]}
              </td>
            </tr>
            `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    `;
  }
}

import Vue from 'vue';
import map from 'lodash/map';

export default (dispute = {}) =>
  new Vue({
    el: '[data-dispute-wrapper]',
    data: {
      dispute,
    },
    computed: {
      personalInformation() {
        const { forms } = this.dispute.data;
        const personalInformationForm = forms['personal-information-form'];

        return {
          Name: personalInformationForm.name,
          Address:
            personalInformationForm.address || personalInformationForm.address1,
          'Address 2': personalInformationForm.address2,
          City: personalInformationForm.city,
          State: personalInformationForm.state,
          Zip: personalInformationForm['zip-code'],
          Email: personalInformationForm.email,
          Phone: personalInformationForm.phone,
          'Phone 2': personalInformationForm.phone2,
          Creditor: personalInformationForm['agency-name'],
        };
      },
    },
    render() {
      if (!this.dispute.data || !this.dispute.data.forms) {
        return <div>No saved form data</div>;
      }

      return (
        <div class="max-width-2 mx-auto">
          <h3 class="pb3">Personal Information</h3>
          <dl class="FormView">
            {map(this.personalInformation, (value, key) => (
              <span key={key}>
                <dt>{key}</dt>
                <dd>{value || '-'}</dd>
              </span>
            ))}
          </dl>
        </div>
      );
    },
  });

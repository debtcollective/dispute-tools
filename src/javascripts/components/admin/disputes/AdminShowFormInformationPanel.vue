<template>
  <div class="-fw mx-auto">
    <alert :alerts="alerts"/>
    <div v-if="!(uploading || loading)">
      <h3 v-if="!form" class="max-width-2 mx-auto">No saved form data.
        <br>
        Dispute Status: {{ status }}
      </h3>
      <div v-else>
        <div class="max-width-2 mx-auto">
          <h3 class="pb1 center">Personal Information</h3>
          <h4
            class="center"
            v-if="status === 'Completed'"
          >{{ pendingSubmission ? 'Debt Collective to mail dispute' : 'User to mail dispute' }}</h4>
          <h4 class="pb1 center">{{ status }}</h4>

          <h5 class="pb3 center">
            <a
              class="-k-btn btn-primary -fw-600"
              :href="`/admin/disputes/${dispute.id}`"
            >Edit dispute form data</a>
          </h5>

          <dl class="FormView mb1">
            <span v-for="(val, key) in userProfileInformation" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ val || '-' }}</dd>
            </span>
          </dl>

          <div class="FormView mb1">
            <h4 class="center mb1">Attachments</h4>
            <div v-if="attachments && attachments.length" class="-fw">
              <attachment
                v-for="attachment in attachments"
                :key="attachment.id"
                :attachment="attachment"
                entity-name="disputes"
                :on-delete="handleAttachmentDelete"
              />
            </div>
            <h3 v-else class="center">None</h3>

            <form class="center mt2" @submit="e => e.preventDefault()">
              <div class="relative -k-btn btn-sm btn-primary -fw-500 -fw">
                Upload attachments to dispute
                <input
                  type="file"
                  name="attachment"
                  accept="pdf, png, jpeg"
                  multiple="true"
                  class="absolute top-0 left-0 -fw -fh"
                  style="opacity: 0"
                  @change="handleAttachmentUpload"
                >
              </div>
            </form>
          </div>

          <dl class="FormView mb1">
            <span v-for="(val, key) in personalInformation" v-if="val !== null" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ val || '-' }}</dd>
            </span>
          </dl>

          <div class="FormView">
            <h5>Debt Types</h5>
            <table class="-fw text-left">
              <tr>
                <th>Type</th>
                <th>Amount</th>
              </tr>
              <tr v-for="(debt, index) in debts" :key="index">
                <td>{{ debt.type }}</td>
                <td>{{ debt.amount }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div v-if="ffel !== null" class="max-width-2 mt3 mx-auto">
          <h3 class="pb1 center">FFEL Loan Information</h3>
          <dl class="FormView">
            <span v-for="(val, key) in ffel" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ val || '-' }}</dd>
            </span>
          </dl>
        </div>
      </div>
    </div>

    <div v-if="uploading || loading">
      <div class="p4">
        <div class="max-width-2">
          <h3 class="center p4">
            {{
            uploading
            ? 'The documents are being uploaded...'
            : loading
            ? 'Loading dispute and member data...'
            : ''
            }}
            <div class="spinner"></div>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { uploadAttachment, getDispute } from '../../../lib/api';
import { DebtTypes } from '../../../../../shared/enum/DebtTypes';
import Modal from '../../Modal';
import Alert from '../../../components/Alerts.vue';
import Attachment from '../../../components/Attachment.vue';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const getFormOrElse = ({
  id,
  data,
  user,
  attachments = [],
  statuses: [{ status, pendingSubmission }],
}) => {
  if (data && (data.forms || data._forms)) {
    return {
      disputeId: id,
      form: _.get(data._forms || data.forms, 'personal-information-form'),
      status,
      user,
      pendingSubmission,
      attachments,
    };
  }
  return { form: false, status, user: false, pendingSubmission };
};

export default {
  components: {
    Alert,
    Attachment,
  },
  props: {
    initialDispute: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ...getFormOrElse(this.initialDispute),
      dispute: this.initialDispute,
      uploadSpinnerModal: new Modal({
        name: 'UploadSpinnerModal',
        element: document.querySelector('[data-component-modal="block-while-uploading-modal"]'),
      }),
      uploading: false,
      alerts: [],
      loading: false,
    };
  },
  computed: {
    personalInformation() {
      return {
        Name: this.form.name,
        Address: this.form.address || this.form.address1,
        'Address 2': this.form.address2,
        City: this.form.city,
        State: this.form.state,
        Zip: this.form['zip-code'],
        Email: this.form.email || this.user.email,
        Phone: this.form.phone || this.user.phone,
        'Phone 2': this.form.phone2,
        Creditor: _.join(
          _.filter([
            this.form['agency-name'],
            this.form['firm-name'],
            this.form.originalCreditor,
            this.form.currentCreditor,
          ]),
          ', ',
        ),
      };
    },
    debts() {
      let debtType = this.form['debt-type'];
      const debtAmount = this.form['debt-amount'];
      let debts = this.form.debts || [];

      if (debtType || debtAmount) {
        debtType || (debtType = 'other');

        debts = [{ type: debtType, amount: debtAmount }];
      }

      _.forEach(debts, debt => {
        debt.type = _.startCase(debt.type);
        debt.amount = this.formatCurrency(debt.amount);
      });

      return debts;
    },
    ffel() {
      if (this.form['ffel-loan-radio-option'] === 'yes') {
        return {
          Agency: this.form.guarantyAgency,
          City: this.form.guarantyAgencyCity,
          Address: this.form.guarantyAgencyMailingAddress,
          State: this.form.guarantyAgencyState,
          Zip: this.form.guarantyAgencyZipCode,
        };
      } else {
        return null;
      }
    },
    userProfileInformation() {
      return {
        Username: this.user.username,
        Fullname: this.user.name,
        Email: this.user.email,
        Zip: this.user.zip,
        State: this.user.state,
        Phone: this.user.phoneNumber,
      };
    },
  },
  methods: {
    updateData({ dispute }, clearAlerts = true) {
      this.loading = clearAlerts;

      // Ensures we always have the most up-to-date information about the dispute,
      // not just what was passed as a property of the paginated table
      return getDispute(dispute.id)
        .then(dispute => {
          this.alerts = clearAlerts ? [] : this.alerts;
          const { form, user, status, pendingSubmission, attachments } = getFormOrElse(dispute);
          this.form = form;
          this.status = status;
          this.dispute = dispute;
          this.user = user;
          this.pendingSubmission = pendingSubmission;
          this.attachments = attachments;

          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
          this.alerts = [
            {
              type: 'error',
              message:
                'Unable to fetch most up-to-date dispute data. Please reload the page and try again.',
            },
          ];
        });
    },
    handleAttachmentUpload({ target }) {
      if (!target.files.length) {
        return;
      }

      // validate size
      const MAX_FILE_SIZE = 6000000;
      const allFilesUnderMaxSize = _.every(target.files, file => file.size < MAX_FILE_SIZE);

      if (!allFilesUnderMaxSize) {
        this.alerts = [
          {
            type: 'error',
            message: 'Max file size is 6MB',
          },
        ];

        return;
      }

      this.alerts = [];
      this.uploadSpinnerModal.activate();
      this.uploading = true;

      uploadAttachment(this.dispute, new FormData(target.form))
        .then(() => {
          this.updateData(this, false).then(() => {
            this.uploading = false;
            this.alerts = [
              {
                type: 'success',
                message: `Attachment${target.files.length > 1 ? 's' : ''} successfully uploaded.`,
              },
            ];
          });
        })
        .catch(e => {
          console.error(e);
          this.uploading = false;
          this.alerts = [
            {
              message: `Unable to upload attachment. Please try again.`,
              type: 'error',
            },
          ];
        });
    },
    handleAttachmentDelete(attachment) {
      if (attachment !== null) {
        this.alerts = [
          {
            type: 'success',
            message: 'Attachment successfully deleted',
          },
        ];
        this.attachments = this.attachments.filter(a => a.id !== attachment.id);
      } else {
        this.alerts = [
          {
            type: 'error',
            message: 'Unable to delete the attachment. Please try again.',
          },
        ];
      }
    },
    formatCurrency(string) {
      return Number(string).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    },
  },
};
</script>

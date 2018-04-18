<template>
  <div class="mx-auto">
    <h3
      v-if="!form"
      class="max-width-2 pb3">
      No saved form data.
      <br>
      Dispute Status: {{ status }}
    </h3>
    <div v-else>
      <div class="max-width-2">
        <h3 class="pb1 center">
          Personal Information
        </h3>
        <h4 class="center" v-if="status === 'Completed'">
          {{ pendingSubmission ? 'Debt Syndicate to mail dispute' : 'User to mail dispute' }}
        </h4>
        <h4 class="pb1 center">
          {{ status }}
        </h4>

        <h5 class="pb3 center">
          <a class="-k-btn btn-primary -fw-700" :href="`/admin/disputes/${dispute.id}`">Edit dispute form data</a>
        </h5>

        <dl class="FormView mb1">
          <span v-for="(val, key) in userProfileInformation" :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ val || '-' }}</dd>
          </span>
        </dl>

        <div class="FormView mb1" v-if="user.groups && user.groups.filter(g => g.full_name).length">
          <h4 class="center mb1">Groups</h4>
          <div class="flex">
            <div v-for="group in user.groups.filter(g => g.full_name)" :key="group.full_name">
              <span>{{group.full_name}}</span>
            </div>
          </div>
        </div>

        <dl class="FormView">
          <span
            v-for="(val, key) in personalInformation"
            :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ val || '-' }}</dd>
          </span>
        </dl>
      </div>
      <div
        v-if="ffel !== null"
        class="max-width-2 mt3">
        <h3 class="pb1 center">
          FFEL Loan Information
        </h3>
        <dl class="FormView">
          <span
            v-for="(val, key) in ffel"
            :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ val || '-' }}</dd>
          </span>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import { getUserByExternalId } from '../../../lib/api';
import { DebtTypes } from '../../../../../shared/enum/DebtTypes';

const getFormOrElse = ({ data, user, statuses: [{ status, pendingSubmission }] }) => {
  if (data && (data.forms || data._forms)) {
    return {
      form: get(data._forms || data.forms, 'personal-information-form'),
      status,
      user,
      pendingSubmission,
    };
  }
  return { form: false, status, user: false, pendingSubmission };
};

export default {
  props: {
    initialDispute: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { ...getFormOrElse(this.initialDispute), dispute: this.initialDispute };
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
        Creditor: this.form['agency-name'] || this.form['firm-name'],
        'Debt type': DebtTypes[this.form['debt-type']] || null,
        'Debt amount': this.form['debt-amount'],
      };
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
      };
    },
  },
  methods: {
    updateData({ dispute }) {
      const { form, user, status, pendingSubmission } = getFormOrElse(dispute);
      this.form = form;
      this.status = status;
      this.dispute = dispute;
      this.pendingSubmission = pendingSubmission;

      getUserByExternalId(user.externalId).then(u => {
        this.user = { ...user, ...u };
      });
    },
  },
};
</script>

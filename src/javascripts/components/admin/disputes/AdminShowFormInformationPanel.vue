<template>
  <div class="mx-auto">
    <h3
      v-if="!form"
      class="max-width-2 pb3">
      No saved form data.
      <br>
      Dispute Status: {{ status }}
    </h3>
    <div
      v-else
      class="max-width-2">
      <h3 class="pb3">Personal Information</h3>
      <dl class="FormView">
        <span
          v-for="(val, key) in personalInformation"
          :key="key">
          <dt>{{ key }}</dt>
          <dd>{{ val || '-' }}</dd>
        </span>
      </dl>
    </div>
  </div>
</template>

<script>
const getFormOrElse = ({ data, user, statuses: [{ status }] }) => {
  if (data && data.forms) {
    return {
      form: data.forms['personal-information-form'],
      status,
      user,
    };
  }
  return { form: false, status, user: false };
};

export default {
  props: {
    initialDispute: {
      type: Object,
      required: true,
    },
  },
  data() {
    return getFormOrElse(this.initialDispute);
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
      };
    },
  },
  methods: {
    updateData({ dispute }) {
      const { form, user, status } = getFormOrElse(dispute);
      this.form = form;
      this.user = user;
      this.status = status;
    },
  },
};
</script>

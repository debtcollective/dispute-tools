<template>
  <form
    @submit="submit"
    method="post"
    :action="formAction">
    <input
      type="hidden"
      name="_csrf"
      :value="csrfToken" >
    <input
      type="hidden"
      name="_method"
      value="PUT"
      v-if="event.id" >

    <div :class="'py1' + (nameErrors.length ? ' error' : '')">
      <Label
        name="name"
        label="Event Name" />
      <input
        class="-k-input -fw -border-neutral-mid"
        id="name"
        name="name"
        v-model="name"
        placeholder="A short, clear name"
      >
      <form-errors :errors="nameErrors" />
    </div>
    <div :class="'py1' + (dateErrors.length ? ' error' : '')">
      <Label
        name="date"
        label="Date" />
      <flat-pickr
        name="date"
        v-model="date"
        :config="dateConfig"
        placeholder="mm/dd/yyyy"
        class="-k-input -fw -border-neutral-mid"
      />
      <form-errors :errors="dateErrors" />
    </div>
    <div :class="'py1' + (timespanErrors.length ? ' error' : '')">
      <Label
        name="timespan"
        label="Timespan" />
      <input
        name="timespan"
        id="timespan"
        class="-k-input -fw -border-neutral-mid"
        v-model="timespan"
        placeholder="e.g: 6:30 pm - 8:30 pm PST"
      >
      <form-errors :errors="timespanErrors" />
    </div>
    <div :class="'py1' + (descriptionErrors.length ? ' error' : '')">
      <Label
        name="description"
        label="Description" />
      <textarea
        name="description"
        id="description"
        rows="6"
        class="-k-textarea -fw -ff-sec -border-neutral-mid"
        v-model="description"
        placeholder="Tell people more about the event"
      />
      <form-errors :errors="descriptionErrors" />
    </div>
    <div :class="'py1' + (locationErrors.length ? ' error' : '')">
      <Label
        name="location"
        label="Location" />
      <input
        name="location"
        id="location"
        type="text"
        ref="locationInput"
        placeholder="Location"
        :value="location"
        class="-k-input -fw -border-neutral-mid mb2"
      >
      <google-map-render
        :gmaps-key="gmapsKey"
        :value="location"
      />
      <form-errors :errors="locationErrors" />
    </div>

    <div class="pt3">
      <button
        class="-k-btn btn-primary -fw -fw700"
        type="submit"
        :disabled="buttonDisabled"
      >
        {{ event.id ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<script>
import Checkit from '../../../../../../shared/Checkit';
import moment from 'moment';
import FlatPickr from 'vue-flatpickr-component';
import Label from '../../../Label.vue';
import GoogleMapRender from '../../../GoogleMapRender.vue';
import FormErrors from '../../../FormErrors.vue';
import { csrfToken } from '../../../../lib/api';

const constraints = {
  name: ['required'],
  description: ['required'],
  date: ['required'],
  timespan: ['required'],
  location: ['required'],
};

const checkit = new Checkit(constraints);

export default {
  components: {
    Label,
    FlatPickr,
    GoogleMapRender,
    FormErrors,
  },
  props: {
    campaign: {
      type: Object,
      default() {
        return {};
      },
    },
    event: {
      type: Object,
      default() {
        return {};
      },
    },
    gmapsKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: this.event.name || '',
      nameErrors: [],
      description: this.event.description || '',
      descriptionErrors: [],
      date: this.event.date || '',
      dateErrors: [],
      timespan: this.event.timespan || '',
      timespanErrors: [],
      location: this.event.locationName || '',
      locationErrors: [],
      disabledDates: {
        to: moment().subtract(1),
      },
      buttonDisabled: false,
      autocomplete: null,
      csrfToken,
      dateConfig: {
        allowInput: true,
        minDate: new Date(),
        dateFormat: 'm/d/Y',
        altInput: true,
        altFormat: 'm/d/Y',
      },
    };
  },
  computed: {
    formAction() {
      let ret = `/admin/collectives/${this.campaign.collective.id}/campaigns/${
        this.campaign.id
      }/events`;

      if (this.event.id) {
        ret += `/${this.event.id}`;
      }

      return ret;
    },
  },
  mounted() {
    this.autocomplete = new google.maps.places.Autocomplete( // eslint-disable-line
      this.$refs.locationInput,
    );

    this.autocomplete.addListener('place_changed', () => {
      this.location = this.$refs.locationInput.value;
    });
  },
  methods: {
    submit(event) {
      this.buttonDisabled = true;

      const formValues = Object.keys(constraints).reduce((acc, key) => {
        acc[key] = this[key];
        return acc;
      }, {});

      const [err] = checkit.validateSync(formValues);

      if (err) {
        event.preventDefault();
        this.buttonDisabled = false;
        this.populateErrors(err);
      }
    },
    populateErrors({ errors }) {
      // Set the errors, clearing any old ones in the process
      Object.keys(constraints).forEach(key => {
        this[`${key}Errors`] = errors[key] ? [errors[key].message] : [];
      });
    },
  },
};
</script>

<style>
.flatpickr-day {
  border-radius: 0 !important;
}

.flatpickr-day.selected {
  background-color: #f04c34 !important;
  border-color: #f04c34 !important;
}
</style>

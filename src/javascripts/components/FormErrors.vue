<template>
  <div>
    <p
      class="-on-error -danger -caption -fw-500 mt1"
      v-for="error in errors"
      :key="error">
      ▲ {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
};
</script>


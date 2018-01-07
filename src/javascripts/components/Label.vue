<template>
  <label
    :for="name"
    class="block pb1 -fw-500"
  >
    {{ label }}
  </label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

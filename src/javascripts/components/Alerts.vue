<template>
  <div class="mb2" v-if="alerts.length > 0">
    <div v-for="(alert, index) in alerts" :key="alert.type + index" :class="`Alert wrapper center -fw-500 -${alert.type}`">
      <button v-if="!alert.preventDismiss" class="Alert__close" aria-label="close" type="button" @click="() => alerts.splice(index, 1)"><svg><use xlink:href="#svg-close"/></svg></button>
      <p>{{ alert.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alerts: {
      type: Array,
      required: true,
    },
  },
};
</script>

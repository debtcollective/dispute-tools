<template>
  <div class="google-map-render-container">
    <iframe
      id="iframe-map"
      width="100%"
      height="100%"
      frameborder="0"
      style="margin-bottom: -6px"
      allowfullscreen
      :src="iframeSrc"
    />
  </div>
</template>

<script>
export default {
  props: {
    gmapsKey: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  computed: {
    iframeSrc() {
      return `https://www.google.com/maps/embed/v1/place?key=${
        this.gmapsKey
      }&q=${this.value || 'new+york'}`;
    },
  },
};
</script>

<style>
.google-map-render-container {
  border: 1px solid #9b9b9b;
  border-radius: 2px;
  width: 100%;
  height: 100%;
  padding-right: 1px;
}
</style>

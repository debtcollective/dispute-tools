<template>
  <div class="flex justify-between items-center my1" v-if="!deleted">
    <!-- <span class="Tool__Info-badge inline-block center -fw-700 -ttu-rounded">{{ext}}</span> -->
    <a class="-k-btn btn-dark -fw" target="_blank" :href="href" aria-label="Download attachment">{{name}}</a>
    <button class="-k-btn btn-clear ml2" type="button" @click="handleDelete">
      <svg class="-danger" width="10" height="10">
        <use xlink:href="#svg-close" />
      </svg>
    </button>
  </div>
</template>

<script>
import { req } from '../lib/api';

export default {
  props: {
    attachment: {
      type: Object,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      default: 'disputes',
    },
    onDelete: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  data: () => ({
    deleted: false,
  }),
  computed: {
    href() {
      return `/admin/${this.entityName}/${this.attachment.foreignKey}/attachment/${
        this.attachment.id
      }`;
    },
    name() {
      return this.attachment.fileMeta.original.originalFileName;
    },
    ext() {
      return this.attachment.fileMeta.original.ext;
    },
  },
  methods: {
    handleDelete() {
      return req({
        method: 'delete',
        url: this.href,
      })
        .then(() => {
          this.deleted = true;
          this.onDelete(this.attachment);
        })
        .catch(() => {
          this.deleted = false;
          this.onDelete(null);
        });
    },
  },
};
</script>

<template>
  <div style="width: 100%;height: 100%;">
    <me></me>
  </div>

</template>
<script>
import {defineComponent} from 'vue'
import Me from "@/layout/me/index.vue";

export default defineComponent({
  name: "index",
  components: {
    Me,
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
  }
})
</script>

<style scoped>

</style>
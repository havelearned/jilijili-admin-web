<template>
  <div>
    <iframe style="width: 100%;height: 100vmin"
            ref="monitorIframe"
            src="http://localhost:9092/wallboard"
    ></iframe>
  </div>

</template>
<script>
import {defineComponent} from 'vue'
import CommentPreview from "@/components/commentPreview.vue";

export default defineComponent({
  name: "monitor",
  components: {CommentPreview}
})
</script>


<style scoped>

</style>
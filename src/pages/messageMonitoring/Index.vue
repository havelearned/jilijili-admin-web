<template>
  <div>
    <q-form @submit="OnSubmit" style="width: 500px">
      <FileUpload ref="refFileUpload" maxFile="3" accept=".jpg" label="头像上传" :auto="true"></FileUpload>

      <q-btn label="提交" type="submit"></q-btn>
    </q-form>

  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import FileUpload from "src/composables/upload/FileUpload.vue";

export default defineComponent({
  components: {FileUpload},
  setup() {
    const refFileUpload = ref(null);

    return {
      refFileUpload,
      OnSubmit() {
        console.log("最终获取地址==>",
          refFileUpload.value.getPublicNetworkAccessUrl());

      }
    }

  }
})


</script>

<style scoped>

</style>

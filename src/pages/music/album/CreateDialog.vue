<template>
  <q-dialog
    v-model="isOpen"
    persistent transition-show="scale" transition-hide="scale"

  >
    <q-card flat bordered class="my-card bg-grey-1" style="min-width: 400px">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">添加专辑</div>
          </div>
        </div>
      </q-card-section>
      <q-form @submit="onSubmit" @reset="onReset">
        <q-card-section>
          <SingerSearch ref="getFinalValue"></SingerSearch>
        </q-card-section>
        <q-card-section>
          <q-input
            clearable
            filled
            v-model="albumData.albumName"
            label="专辑名称"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '专辑名称不能为空']"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            clearable
            type="textarea"
            v-model="albumData.details"
            shadow-text="0-998个字符"
            label="专辑介绍"
          />
        </q-card-section>
        <q-card-section>
          <FileUpload ref="refFileUpload" max-file="1" :auto="true"></FileUpload>

        </q-card-section>
        <q-separator/>
        <q-card-section class="justify-center row q-gutter-lg">
          <q-btn fab color="primary" type="submit" :loading="btnLoading">添加</q-btn>
          <q-btn fab color="grey" type="reset">重置</q-btn>
          <q-btn fab flat type="reset" @click="isOpen=!isOpen">取消</q-btn>
        </q-card-section>
      </q-form>
    </q-card>
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
  </q-dialog>
</template>

<script setup>

import {add} from "src/api/album"
import {ref} from "vue";
import {useNotify} from "src/composables/useNotify";
import SingerSearch from "src/composables/music/SingerSearch.vue";
import FileUpload from "src/composables/upload/FileUpload.vue";

const getFinalValue = ref()
const refFileUpload = ref()
const emit = defineEmits(['search'])
let isOpen = ref(false);
let btnLoading = ref(false)
const bar = ref(null)
const loading = ref(false)
const albumData = ref({
  singerId: undefined, // 歌手id
  albumName: undefined,
  details: undefined,
  albumImg: undefined,
})
const onSubmit = () => {
  btnLoading.value = true
  const barRef = bar.value
  barRef.start()

  // 从子组件中获取歌手id
  albumData.value.singerId = getFinalValue.value.getFinalValues()

  // 从子组件中获取文件url,
  albumData.value.albumImg = refFileUpload.value.getPublicNetworkAccessUrl()[0]

  add(albumData.value).then(res => {
    if (res.code === 200) {
      useNotify().infoNotify(res.message)
      isOpen.value = !isOpen.value

    } else {
      useNotify().negativeNotify(res.message)
    }
    btnLoading.value = false
    barRef.stop()
  })

  emit("search")

}
const onReset = () => {
  albumData.value.albumName = undefined
  albumData.value.details = undefined
}

const changeDialog = () => {
  isOpen.value = !isOpen.value;
}
defineExpose({
  changeDialog
})


</script>

<style scoped lang="less">

</style>

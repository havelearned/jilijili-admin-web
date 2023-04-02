<template>
  <q-dialog
    v-model="isOpen"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">添加歌手</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row justify-center">
          <q-card-section class="col-6">
            <q-input filled
                     v-model="createData.singerName"
                     label="歌手名称(艺名)"
                     hint="2-16个字符" lazy-rules
                     spellcheck="false"
                     :rules="[ val => val && val.length > 0 || '请输入内容']"
            />
          </q-card-section>

          <q-card-section class="col-6">
            <q-select filled v-model="createData.singerType"
                      :options="options" label="歌手类型">
              <template v-if="createData.singerType" v-slot:append>
                <q-icon name="cancel" @click.stop.prevent="createData.singerType = null" class="cursor-pointer"/>
              </template>
            </q-select>
          </q-card-section>

          <q-card-section class="col-6">

            <q-uploader
              @added="attachmentUploaded"
              @uploaded="attachmentUploaded"
              @uploading="uploading"
              @factory-failed="factoryFailed"
              @finish="finish"
              :url="url"
              style="max-width: 300px"
              hide-upload-button
              label="歌手头像上传"
              multiple
              accept=".jpg, image/*"
              max-file="1"
              auto-upload
              no-thumbnails
              @rejected="onRejected"
            />
          </q-card-section>

          <q-card-section class="col-6">
            <q-input filled
                     v-model="createData.singerDetails"
                     label="歌手介绍"
                     hint="2-998个字符" lazy-rules
                     type="textarea"
                     spellcheck="false"
                     :rules="[ val => val && val.length > 2 || '请输入内容']"
            />
          </q-card-section>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="添加" v-close-popup/>
        <q-btn flat label="取消" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {ref} from "vue";
import {useNotify} from "src/composables/useNotify";
import {uploadOssUrl} from "src/api/upload";
import {useUpload} from "src/composables/useUpload";

const{
  onRejected,
  attachmentUploaded,
  factoryFailed,
  uploading,
  finish
}=useUpload()

let isOpen = ref(false);
const url = uploadOssUrl
console.log(url)
const createData = ref(
  {
    singerName: null, // 歌手名称
    singerType: '原唱', // 歌手类型
    singerDetails: null, // 歌手信息
    singerPhoto: null, // 歌手头像
  },
)
const options = ref(['原唱', '翻唱'])

const changeDialog = () => {
  isOpen.value = !isOpen.value;
}
defineExpose({
  changeDialog
})

const addData = {
  singerName: undefined,
  singerPhoto: undefined,
  singerDetails: undefined,
  singerType: undefined
}

</script>

<style scoped>

</style>

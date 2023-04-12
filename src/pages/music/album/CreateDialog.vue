<template>
  <q-dialog
    v-model="isOpen"
    persistent transition-show="scale" transition-hide="scale"
  >
    <q-card flat bordered class="my-card bg-grey-1">

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
          <q-uploader
            :url="uploadOssUrl"
            field-name="file"
            accept=".jpg, .png, .gif, ,.jpeg"
            @uploaded="uploaded"
            :max-files="1"
            auto-upload
            label="专辑封面上传">
            <template v-slot:list="scope">
              <q-list separator>
                <q-item v-for="file in scope.files" :key="file.__key">
                  <q-item-section>
                    <q-item-label class="full-width ellipsis">
                      {{ file.name }}
                    </q-item-label>

                    <q-item-label caption>
                      Status: {{ file.__status }}
                    </q-item-label>

                    <q-item-label caption>
                      {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section
                    v-if="file.__img"
                    thumbnail
                    class="gt-xs"
                  >
                    <img :src="file.__img.src" :alt="file.name">
                  </q-item-section>

                  <q-item-section top side>
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="scope.removeFile(file)"
                    />
                  </q-item-section>
                </q-item>

              </q-list>
            </template>
          </q-uploader>
          <q-input
            clearable
            filled
            label="专辑封面"
            lazy-rules
            :rules="[value => value&&value.length>0 || '专辑封面不能为空']"
            type="tel"
            disable
            v-model="albumData.albumImg"></q-input>
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
import {uploadOssUrl} from "src/api/upload";
import SingerSearch from "src/composables/music/singer/SingerSearch.vue";

const getFinalValue = ref()
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
const uploaded = (info) => {
  let res = JSON.parse(info.xhr.response);
  if (res.code === 200) {
    useNotify().infoNotify("封面上传成功")
    albumData.value.albumImg = res.data;
    return
  }
  useNotify().infoNotify("封面上传失败")
}
const onSubmit = () => {
  btnLoading.value = true
  const barRef = bar.value
  barRef.start()
  console.log("提交表单", albumData.value)

  // 从子组件中获取歌手id
  albumData.value.singerId = getFinalValue.value.getFinalValues()

  add(albumData.value).then(res => {
    console.log(res)
    if (res.code === 200) {
      useNotify().infoNotify(res.message)
      isOpen.value = !isOpen.value
    } else {
      useNotify().negativeNotify(res.message)
    }
    btnLoading.value = false
    barRef.stop()
  })

}

const onReset = () => {
  console.log("重置表单")
  albumData.value.albumName = undefined
  albumData.value.details = undefined
}

const changeDialog = () => {
  isOpen.value = !isOpen.value;
}
defineExpose({
  changeDialog
})


function singerRules(rules) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(!!rules || '* Required')
    }, 1000)
  })

}


</script>

<style scoped lang="less">

</style>

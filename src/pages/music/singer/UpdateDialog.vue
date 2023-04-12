<template>
  <q-dialog
    v-model="isOpen"
    persistent transition-show="scale" transition-hide="scale"
  >


    <q-card flat bordered class="my-card bg-grey-1">

      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">修改歌手</div>
          </div>
        </div>
      </q-card-section>
      <q-form @submit="onSubmit">
        <q-card-section>
          <q-input
            clearable
            filled
            v-model="singerData.singerName"
            label="歌手名称(艺名)"
            lazy-rules
            :rules="[ val => val && val.length > 0 || '歌手名称不能为空']"
          />
          <q-select filled
                    clearable
                    transition-show="flip-up"
                    transition-hide="flip-down"
                    v-model="singerData.singerType"
                    label="歌手类型"
                    lazy-rules
                    emit-value
                    map-options
                    :rules="[value => value|| '歌手类型不能为空']"
                    :options="singer_type_selection">

          </q-select>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            clearable
            type="textarea"
            v-model="singerData.singerDetails"
            shadow-text="0-998个字符"
            label="歌手介绍"
          />
        </q-card-section>

        <q-card-section>
          <q-uploader
            :url="uploadLocalUrl"
            field-name="file"
            accept=".jpg, .png, .gif, ,.jpeg/*"
            @uploaded="uploaded"
            :max-files="1"
            auto-upload
            label="歌手上传">
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
            label="头像地址"
            lazy-rules
            :rules="[value => value || '歌手头像不能为空']"
            type="tel"
            disable
            v-model="singerData.singerPhoto"></q-input>
        </q-card-section>

        <q-separator/>
        <q-card-section class="justify-center row q-gutter-lg">
          <q-btn fab color="primary" type="submit" :loading="btnLoading">修改</q-btn>
          <q-btn fab flat @click="isOpen=!isOpen">取消</q-btn>
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

import {ref} from "vue";
import {singer_type_selection} from "src/utils/dictionary";
import {singerInfo, updated} from "src/api/singer";
import {useNotify} from "src/composables/useNotify";
import {uploadLocalUrl} from "src/api/upload";

let isOpen = ref(false);
let btnLoading = ref(false)
const bar = ref(null)
const singerData = ref({
  id: undefined,
  singerName: undefined,
  singerType: undefined,
  singerDetails: undefined,
  singerPhoto: undefined
})
const uploaded = (info) => {
  let res = JSON.parse(info.xhr.response);
  if (res.code === 200) {
    useNotify().infoNotify("头像上传成功")
    singerData.value.singerPhoto = res.data;
    return
  }
  useNotify().infoNotify("头像上传失败")


}
const onSubmit = () => {
  btnLoading.value = true
  const barRef = bar.value
  barRef.start()

  console.log("提交表单", singerData.value)
  updated(singerData.value).then(res => {
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


const changeDialog = (id) => {
  console.log("歌手id==>",id)
  singerInfo(id).then(res=>{
    if(res.code===200){
      singerData.value = res.data
    }else{
      useNotify().negativeNotify("修改信息获取失败")
    }
  })
  isOpen.value = !isOpen.value;
}
defineExpose({
  changeDialog
})


</script>

<style scoped lang="less">

</style>

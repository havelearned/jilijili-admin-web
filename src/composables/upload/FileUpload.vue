<!--
 * @FileDescription: 多文件上传组件,默认最多上传5个文件,每个文件大小10mb,总大小不得超过50mb
 * @Author: amani
 * @Date: 2023-04-12 13:54:34
 * @LastEditors: amani
 * @LastEditTime: amani
-->
<template>
  <div>
    <!-- equivalent -->
    <q-file
      name="files"
      filled
      multiple
      bottom-slots
      counter
      use-chips
      append
      :loading="loading"
      :disable="loading"
      :label="label"
      :max-files="maxFile"
      :accept="accept"
      max-file-size="100000000"
      max-total-size="500000000"
      v-model="model"
      :counter-label="counterLabel"
      :filter="checkFile"
      @update:model-value="updateModelValue"
      @rejected="onRejected"
      :rules="[fileRules]"
    >
      <template v-slot:prepend>
        <q-icon name="cloud_upload" @click.stop.prevent/>
      </template>
      <template v-if="model" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="model = null" class="cursor-pointer"/>
        <q-btn v-if="!auto" round dense flat icon="upload" @click="executeUploadFile"/>
      </template>
      <template v-slot:hint>
        没有文件
      </template>
      <template v-slot:loading>
        <q-inner-loading :showing="loading"
                         label="Please wait..."
                         label-class="text-teal"
                         label-style="font-size: 1.1em">
          <q-spinner-gears size="50px" color="primary"/>
        </q-inner-loading>
      </template>
    </q-file>
  </div>
</template>

<script>
import {ref} from "vue";
import {useNotify} from "src/composables/useNotify";
import {uploadLocal} from "src/api/upload";

export default {
  name: "FileUpload",
  props: {
    maxFile: {type: String, required: false, default: '5'},
    accept: {type: String, required: false, default: '.bmp, .gif , .jpg, .jpeg, .png, image/*'},
    label: {type: String, required: false, default: '文件上传'},
    auto: {type: Boolean, required: false, default: false},
    verify: {type: Boolean, required: false, default: true},
  },
  setup(props) {
    const model = ref(null)
    const result = ref()
    const loading = ref(false)
    // 文件开始上传
    const executeUploadFile = () => {
      loading.value = true
      return new Promise((resolve, reject) => {
        // 创建文件上传对象
        let formData = new FormData();
        model.value.forEach(file => {
          formData.append("files", file, file.name)
        })
        uploadLocal(formData).then(res => {
          if (res.code === 200) {
            result.value = res.data
            resolve(result.value)
            loading.value = false
            console.log("文件url=>", res.data)
            useNotify().infoNotify(`上传成功`)
          } else {
            loading.value = false
            useNotify().negativeNotify(`上传失败`)
            result.value = undefined
            reject()
          }
        })

      })
    }

    // 得到文件URL,返回rul列表数组
    const getPublicNetworkAccessUrl = () => {
      return result.value;

    }
    return {
      model, result, loading,
      executeUploadFile, getPublicNetworkAccessUrl,
      counterLabel({totalSize, filesNumber, maxFiles}) {
        return `最大上传 ${maxFiles} 个文件,当前:${filesNumber}个文件,总大小:${totalSize}`
      },
      // 文件校验
      fileRules(file) {
        return true
      },
      // 拒绝的条目
      onRejected(rejectedEntries) {
        rejectedEntries.forEach(item => {
          switch (item.failedPropValidation) {
            case "max-files":
              useNotify().negativeNotify(`文件个数超过限定值`)
              break;
            case "accept":
              useNotify().negativeNotify(`上传的文件类型不一致`)
              break;
            case "max-file-size":
              useNotify().negativeNotify(`文件过大无法上传`)
              break;
            case "max-total-size":
              useNotify().negativeNotify(`总体文件过大无法上传`)
              break;
            case "filter":
              useNotify().negativeNotify(`不符合上传条件`)
              break;
          }
        })
      },

      // 文件过滤,在用户选择后
      checkFile(files) {
        return files.filter(file => {
          return true
        })
      },
      // 更新文件时调用
      updateModelValue(value) {
        console.log(model.value)
        if (props.auto) {
          executeUploadFile()
        }
      },
      setMode(value){
        model.value = []
        model.value.push(value);
      }

    }
  }
}
</script>

<style scoped>

</style>

<!--通用的预览组件-->

<template>
  <q-page>
    <q-page-container>
      <q-header>
        <q-toolbar>
          <q-btn flat round dense @click="goBack" icon="arrow_back" label="返回"/>
          <q-toolbar-title>文件预览</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-sticky position="top">
        <q-banner inline-actions>
          <q-avatar icon="description" size="40px"/>
          <div>
            <q-card-title>{{ fileName }}</q-card-title>
            <q-card-subtitle>{{ fileType }}</q-card-subtitle>
          </div>
        </q-banner>
      </q-page-sticky>

      <q-page-sticky position="bottom">
        <!-- 在这里添加文件预览内容 -->
        <div v-if="fileType === 'image'">
          <q-img :src="fileUrl" :alt="fileName"/>
        </div>
        <div v-else-if="fileType === 'pdf'">
          <q-pdf :src="fileUrl" style="height: 80vh;"></q-pdf>
        </div>
        <div v-else>
          <p>不支持的文件类型</p>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "commentPreview",
  props: {
    fileType: String, // 文件类型，例如 'image', 'pdf', 'word', 'excel' 等
    fileName: String, // 文件名称
    fileUrl: String,   // 文件的URL或其他合适的预览内容
    // 文件类型: 1 图片 ,2 office文件,3其他文件


    // 文件数据,必须是一个数组
    fileData: {
      default: Object,
      require: true,
    }
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
    console.log(this.fileType);
    console.log(this.fileData);
  }
})
</script>

<style scoped>

</style>
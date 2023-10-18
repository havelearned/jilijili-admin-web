<template>
  <div class="column q-pa-md q-gutter-xs" style="width: 340px">
    <div class="text-h4">
      通知
    </div>
    <q-separator size="3px" color="black" spaced/>
    <q-scroll-area style="width:300px;height: 250px">
      <q-card style="max-width: 300px" v-for="() in 10" v-if="!noticeList">
        <q-skeleton height="150px" square/>
        <q-card-actions align="right" class="q-gutter-md">
          <q-skeleton type="QBtn"/>
          <q-skeleton type="QBtn"/>
        </q-card-actions>
      </q-card>

      <q-card style="max-width: 300px; background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
              class="my-card text-white q-gutter-xs q-ma-md"
              v-for="(item,index) in noticeList" v-else
              :key="item.notifyId"
      >
        <q-card-section>
          <div class="text-h6">{{ getDictLabel(dictNotifyType, item.notifyType) }}</div>
          <div class="text-subtitle2">{{ formatDate(item.createdTime, 'yyyy-MM-dd') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none" style="word-break: break-all;">
          {{ item.notifyContent }}
        </q-card-section>
        <q-card-actions align="right" class="q-gutter-md">
          <q-btn label="知道了" type="QBtn" color="blue" @click="hideOrRemove(item)"/>
        </q-card-actions>
      </q-card>
    </q-scroll-area>

    <div class="text-h6 right" v-if="!noticeList">
      暂无通知
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {formatDate, ellipsis} from '@/boot/datatype'
import {getDictLabel} from "@/boot/dictionary";
import {addOrUpdateNotify, getDictItem} from "@/boot/api/sys/tool";
import Cookie from "@/boot/cookie";

export default defineComponent({
  name: "notice",
  props: {
    noticeList: {
      type: [],
      require: true,
    }
  },
  emits: ['hideOrRemove'],
  data() {
    return {
      dictNotifyType: []
    }
  },
  methods: {
    getDictLabel, formatDate, ellipsis,
    hideOrRemove(row) {
      // 移除元素
      this.noticeList.splice(this.noticeList.indexOf(row), 1)
      // 修改通知状态
      this.editNotifyStatus(row)
    },
    editNotifyStatus(row) {
      row.notifyStatus = 1
      row.publish = 2
      addOrUpdateNotify(row).then(res => {
      }).catch(error => {
        console.log(error)
      }).finally(()=>{
        Cookie.setLocalKeyValue(Cookie.NOTICEMESSAGE,this.noticeList)
      })
    }
  },
  created() {
    getDictItem("sys_notify_type").then(res => {
      this.dictNotifyType = res.data
    })
  },
  beforeUnmount() {


  }

})
</script>


<style scoped>

</style>
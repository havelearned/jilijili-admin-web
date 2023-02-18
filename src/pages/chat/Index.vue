<template>
  <q-fab class="fab-flex" color="purple" icon="keyboard_arrow_up" direction="left">
    <q-card class="card-flex my-card bg-grey text-white">
      <div class="q-pa-md bg-transparent">这个是测试聊天机器人</div>
      <div id="virtual-scroll-target" class="scroll" style="width: 400px;max-height: 230px">
        <q-virtual-scroll
          scroll-target="#virtual-scroll-target"
          :items="heavyList"
          separator
          v-slot="{ item, index }"
        >
          <q-chat-message
            avatar="https://cdn.quasar.dev/img/avatar3.jpg"
            :text="['hey, how are <strong>you</strong>?']"
            stamp="7 minutes ago"
            sent
            bg-color="amber-7"
          />
          <q-chat-message
            name="<span class='text-negative'>Jane (trusted name but untrusted text)</span>"
            name-html
            avatar="https://cdn.quasar.dev/img/avatar5.jpg"
            :text="['doing fine, how r you?','I just feel like typing a really, really, <strong>REALLY</strong> long message to annoy you...']"
            size="6"
            stamp="4 minutes ago"
            text-color="white"
            bg-color="primary"
          />
        </q-virtual-scroll>

      </div>
      <q-card-actions class="btn-flex">
        <q-input borderless outlined   label="请输入内容" type="text" />
        <q-btn  outline>发送</q-btn>
        <q-btn  outline>选择文件</q-btn>

      </q-card-actions>
    </q-card>
  </q-fab>
</template>

<script>
import {ref} from "vue";

export default {
  name: "index",
  setup() {
    const text = ref("")
    const mySpeak= ref({
      name:"讨论的代码",
      nameHtml: true, // 编程语言
      avatar:"https://cdn.quasar.dev/img/avatar3.jpg",
      text:"",
      stamp:"", //发送时间
      sent: false, // 是否发送方发言
      bgColor: "amber-7",
    })

    const maxSize = 10
    const heavyList = []

    for (let i = 0; i < maxSize; i++) {
      heavyList.push({
        label: 'Option ' + (i + 1)
      })
    }

    return {
      heavyList
    }
  }
}
</script>

<style scoped lang="less">
.fab-flex {
  position: fixed;
  right: 50px;
  bottom: 50px;
  .card-flex {
    position: absolute;
    right: 1px;
    bottom: 1px;
  }
}
.btn-flex{
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  background-color: darkgrey;

  q-input{
    background-color: #1D1D1D;
    order: 2;
    flex-grow: 1;
  }
  q-btn{
    order: 1;
    flex-grow: 0;
  }
}

</style>

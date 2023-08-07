<template>
  <div class="">
    <q-layout view="lHh Lpr Rff" container style="height: 73vh" class="shadow-2 rounded-borders">
      <q-header elevated class="bg-black">
        <q-toolbar>
          <div class="row" v-for="(tab,index) in tabOptions">
            <q-btn class="q-ma-xs" split color="primary" push glossy no-caps
                   :label="tab.username"
                   @click="toTab(tab)">
              <q-icon name="clear" size="xs" color="red" @click="removeTab(tab)"></q-icon>
              <q-badge align="bottom" color="red" floating>22</q-badge>
            </q-btn>

          </div>
          <q-toolbar-title>正在和 {{ chatUser.username }} 沟通</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu"/>
        </q-toolbar>
      </q-header>
      <q-drawer
          side="right"
          v-model="drawer"
          show-if-above
          :width="200"
          :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon color="primary" name="smart_toy"></q-icon>
              </q-item-section>
              <q-item-section>
                ai 聊天
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-input clearable outlined dense placeholder="请输入用户名称" class="on-left" debounce="500"
                       v-model="searchForm.username">
                <template #append>
                  <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                    <q-tooltip>搜索</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </q-item>

            <q-item v-for="(user,index) in list" clickable v-ripple
                    @click="sendChat(user)">
              <q-item-section avatar>
                <q-avatar>
                  <q-img :src="user.avatar"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-btn-dropdown push outline fab-mini size="xs" class="glossy" color="teal"
                                :label="user.username">
                  <q-list>
                    <q-item clickable v-close-popup @click="sendCall(user)">
                      <q-item-section>
                        <q-item-label>发起音频通话</q-item-label>
                        <q-item-label caption>测试阶段</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="sendVideo(user)">
                      <q-item-section>
                        <q-item-label>发起视频对话</q-item-label>
                        <q-item-label caption>测试阶段</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar class="q-mb-sm">
              <img :src="chatUser.avatar">
            </q-avatar>
            <div class="text-weight-bold">正在与{{ chatUser.username }}沟通</div>
            <div>{{ chatUser.email }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-tab-panels v-model="currPanel" animated class="shadow-2 rounded-borders">
          <q-tab-panel v-for="(tab,index) in tabOptions" :name="tab.userId" v-show="tab.userId === currPanel">
            <div class="q-pa-md row justify-center">
              <div style="width: 100%;" v-for="message in  dynamicMessages">
                <q-chat-message :name="message.name"
                                :avatar="message.avatar"
                                :text="message.text"
                                :stamp="message.stamp"
                                :size="message.size"
                                :sent="message.sent"
                                :text-color="message.textColor"
                                :bg-color="message.bgColor"/>

              </div>

              <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
                <q-btn fab icon="keyboard_arrow_up" color="accent"/>
              </q-page-scroller>
            </div>
          </q-tab-panel>
        </q-tab-panels>


      </q-page-container>
    </q-layout>

    <div class="row full-width q-ma-md">
      <div style="margin:0 auto">
        <q-input filled style="width: 400px" color="black" bottom-slots label="请输入内容"
                 clearable dense
                 v-model="inputText"
        >
          <template v-slot:after>
            <q-icon v-ripple name="send" @click="sendMessage(currPanel)">
              <q-tooltip>发送</q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>

    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import {IndexMixin} from "@/boot/mixins";
import Wsclient from "@/boot/wsclient";
import Cookie from "@/boot/cookie";
import {calculateWidth} from "@/boot/datatype";

export default {
  name: "",
  mixins: [IndexMixin],
  components: {},
  data() {
    return {
      currentUser: Cookie.getCookies(Cookie.USERINFO),
      drawer: false,
      tabOptions: [],
      currPanel: '',
      chatUser: {},
      inputText: '',
      dynamicMessages: [
        {
          id: Date.now(), // You can use a unique ID for each message
          name: 'John', // Change the sender's name
          avatar: 'https://cdn.quasar.dev/img/avatar3.jpg', // Change the sender's avatar URL
          text: ['This is a dynamic message.'], // Message content as an array of strings
          stamp: 'Just now', // Change the timestamp
          size: 6, // Change the size of the message
          textColor: 'black', // Change the text color
          bgColor: 'grey', // Change the background
          sent: true,
        }
      ],
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'roleId', align: 'center', label: '角色id', field: 'roleId',},
        {name: 'roleName', align: 'center', label: '角色标识', field: 'roleName',},
        {name: 'title', align: 'center', label: '角色名称', field: 'title',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      url: {
        list: '/sysUser/list',
        add: '/sysUser',
        edit: '/sysUser',
        uploadUrl: '/file/upload',
        delete: '/sysUser',
        deleteBatch: '/sysUser/',
        exportXlsUrl: '/sysUser/export',
        importExcelUrl: '/sysUser/import',
        getImportTemplate: '/sysUser/get/exportTemplate',
      },
      ws: {
        connUrl: 'http://localhost:8080/multimedia',
        subscribe: '/user/queue/message',
      }
    }
  },
  created() {
    Wsclient.createSocket(this.ws.connUrl, this.ws.subscribe)
  },
  beforeDestroy() {
    Wsclient.disconnect()
  },
  methods: {
    // 发起聊天
    sendChat(user) {
      this.currPanel = user.userId;
      this.chatUser = user;
      const existingTab = this.tabOptions
          .filter(item => item.userId === user.userId);
      if (existingTab.length > 0) {
        return;
      }
      this.tabOptions.push(user)

    },
    // 发起通话
    sendCall(user) {
    },
    // 视频通话
    sendVideo(user) {
      alert(user)
    },

    removeTab(tab) {
      this.tabOptions = this.tabOptions.filter(item => item.userId !== tab.userId)

    },
    toTab(tab) {
      this.currPanel = tab.userId
      this.chatUser = tab

    },
    sendMessage(userId) {
      if (this.inputText.length < 0) return;
      if (!this.chatUser.userId) return;

      let message = {
        senderId: this.currentUser.userId,
        receiverId: this.chatUser.userId,
        message: this.inputText,
        type: 0,
        isRead: 0,
        isDeleted: 0,}
      Wsclient.send('/app/chat', message)

      this.dynamicMessages.push(
          {
            id: this.currentUser.userId, // You can use a unique ID for each message
            name: this.currentUser.username, // Change the sender's name
            avatar: this.currentUser.avatar, // Change the sender's avatar URL
            text: ['1'], // Message content as an array of strings
            stamp: 'Just now', // Change the timestamp
            size: calculateWidth(this.inputText,6).toString(), // Change the size of the message
            textColor: 'black', // Change the text color
            bgColor: 'grey', // Change the background
            sent: true,
          },
      )
    },

  }
}
</script>
<style lang="sass" scoped>
</style>
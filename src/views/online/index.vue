<template>
  <div style="height: 100vmin;width: 100%;,margin: 0 auto">
    <q-layout view="LHh Lpr fFf" container class="shadow-2 rounded-borders full-width full-height">
      <q-header elevated class="bg-black">
        <q-toolbar>
          <div class="row" v-for="(tab,index) in tabOptions">
            <q-btn class="q-ma-xs" split color="primary" push glossy no-caps
                   :label="tab.username"
                   @click="toTab(tab)">
              <q-avatar>
                <q-img :src="splitUrl(tab.avatar)"></q-img>
              </q-avatar>
              <q-icon name="clear" size="xs" color="red" @click="removeTab(tab)"></q-icon>
              <q-badge align="bottom" color="red" floating>22</q-badge>
            </q-btn>
          </div>
          <q-toolbar-title>正在和 {{ chatUser.username }} 沟通</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="exit_to_app"/>
        </q-toolbar>
      </q-header>

      <q-drawer
          side="left"
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

            <q-item v-for="(user,index) in list" :key="user.userId" clickable v-ripple
                    @dblclick="sendChat(user)">
              <q-item-section avatar>
                <q-avatar>
                  <q-img :src="splitUrl(user.avatar)"/>
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
              <img :src="splitUrl(chatUser.avatar)">
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
              <div style="width: 100%;" v-for="item in  currentChatUserRecord">
                <q-chat-message
                    :name="item.username"
                    :avatar="splitUrl(item.avatar)"
                    :text="item.message"
                    :stamp="formatDate(item.createdTime,'yyyy-MM-dd')"
                    :size="calculateWidth(item.size).toString()"
                    :sent="item.sent"
                    :text-color="item.textColor"
                    :bg-color="item.bgColor">
                  <template v-slot:avatar>
                    <q-avatar>
                      <q-img :src="splitUrl(item.avatar)">
                        <template v-slot:error>{{ item.avatar }}</template>
                      </q-img>
                    </q-avatar>
                  </template>
                  <template v-slot:name class="bg-red">
                    {{ item.username }}
                  </template>
                </q-chat-message>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-page-scroller reverse position="top-right" :scroll-offset="20" :offset="[0, 18]">
          <q-btn fab icon="keyboard_arrow_down" color="accent" ref="btn_click_down"/>
        </q-page-scroller>
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
          <q-btn fab icon="keyboard_arrow_up" color="accent"/>
        </q-page-scroller>
      </q-page-container>
    </q-layout>

    <div class="row full-width q-ma-md">
      <div style="margin:0 auto">
        <q-input filled style="width: 400px" color="black" bottom-slots label="请输入内容"
                 clearable dense
                 v-model="inputText"
                 @keyup.enter="sendMessage"
        >
          <template v-slot:after>
            <q-icon v-ripple name="send" @click="sendMessage(currPanel)">
              <q-tooltip>发送</q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>

    </div>

    <!--    通话弹窗-->
    <call ref="call_dialog"/>

  </div>
</template>

<script>
import {IndexMixin} from "@/boot/mixins";
import Wsclient from "@/boot/ws";
import Cookie from "@/boot/cookie";
import {calculateWidth, formatDate, getFileName, splitUrl} from "@/boot/datatype";
import Call from "@/views/online/call.vue";

export default {
  name: "",
  mixins: [IndexMixin],
  components: {},
  data() {

    return {}
  },
  created() {

  },
  beforeDestroy() {

  },
  computed: {},
  methods: {}
}
</script>
<style lang="sass" scoped>
</style>
<template>
  <q-layout view="hHr lpR lFr">
    <!--    头部-->
    <q-header elevated bordered class="bg-black text-white" height-hint="98">
      <q-toolbar class="GPLAY__toolbar ">
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen=!leftDrawerOpen"/>
        <q-avatar>
          <img src="@/assets/logo.svg">
        </q-avatar>
        <h6>Jilijili-Admin v0.0.1 青春版</h6>
        <q-space/>
        <div class="q-pl-md q-gutter-sm row no-wrap items-center">
          <q-btn round dense flat size="14px" icon="apps">
            <q-tooltip>Google Apps</q-tooltip>
          </q-btn>

          <q-btn round dense flat icon="notifications">
            <q-badge color="red" text-color="white" floating v-if="noticeList && noticeList.length>=1">
              {{ noticeList.filter(item => item.notifyStatus === 2).length }}
            </q-badge>
            <q-tooltip>系统通知</q-tooltip>
            <q-popup-proxy>
              <notice :notice-list="noticeList"></notice>
            </q-popup-proxy>
          </q-btn>

          <q-btn dense flat round icon="account_circle" @click="rightDrawerOpen=!rightDrawerOpen">
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>

    </q-header>

    <!--    左边-->
    <q-drawer dark v-model="leftDrawerOpen"
              show-if-above
              :mini="miniState"
              @mouseout="miniState=true"
              @mousemove="miniState=false"
              :breakpoint="500"
              bordered
              :width="250">
      <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          class="fit" style="height: 50vmin;">
        <div class="q-pa-xs row ">
          <q-input dense outlined square rounded v-model="search" placeholder="Search" class="bg-white shadow-1 col"/>
          <q-btn class="GPLAY__toolbar-input-btn shadow-1" color="primary" icon="search" unelevated/>
        </div>
        <div style="margin-right: 20px;">
          <Menus :menu-data="menuData"/>
        </div>
      </q-scroll-area>
    </q-drawer>


    <q-drawer v-model="rightDrawerOpen" side="right" behavior="mobile" overlay bordered>
      <right/>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-sm bg-white">
        <q-breadcrumbs class="row" align="left">
          <q-breadcrumbs-el class="bg-white shadow-1 rounded-borders" v-for="(item,index) in breadcrumbsList"
                            :key="item.menuId">
            <template v-slot:default>
              <q-btn dense :label="item.menuName" flat
                     @click="$router.push({path:`${item.path}`})">
                <q-badge text-color="red" outline v-if="breadcrumbsList.length >=2"
                         @click="removeMenuItem(item)" label="x" class="q-ma-xs house_action"></q-badge>
              </q-btn>
            </template>
          </q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>
      <q-scroll-area style="height: 85vmin" :thumb-style="thumbStyle"
                     :bar-style="barStyle">
        <router-view/>
      </q-scroll-area>
    </q-page-container>

    <q-footer reveal bordered class="bg-black" @keydown.space.prevent="handelSpace">
      <aplayer v-show="false" :audio="audioData" style="height: 100%;width: 100%"/>
    </q-footer>
  </q-layout>
</template>

<script>
import Menus from "@/layout/menu/index.vue";
import aplayer from "@/layout/aplayer/index.vue";
import right from "@/layout/right/index.vue"
import Cookie from "@/boot/cookie";
import Notice from "@/views/system/notice/index.vue";


export default {
  components: {
    Notice,
    Menus,
    aplayer,
    right
  },
  provide: {},
  data() {
    return {
      badgeX: false,
      miniState: true,
      // 滑动条样式
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      },

      leftDrawerOpen: true,
      rightDrawerOpen: false,
      search: undefined,
      menuData: [],
      audioData: {
        name: ' ',
        artist: ' ',
        url: ' ',
        cover: ' ',
        lrc: ' ',
      },
      breadcrumbsList: [],
      noticeList: [],
      noticeMenu: false,
    }
  },
  methods: {
    // 按下空格是事件
    handelSpace(event) {
      if (event.keyCode === 32 || event.key === " ") {
        event.preventDefault();
        // 发送播放或者暂停事件
        // this.$bus.emit("send-playOr-pause", true)
      }
    },
    // 移除面包屑menu
    removeMenuItem(menu) {
      const indexToRemove = this.breadcrumbsList.indexOf(menu);
      if (indexToRemove !== -1) {
        this.breadcrumbsList.splice(indexToRemove, 1);
      }
      let path = "/" + menu.path

      if (path === this.$route.path) {
        // 关闭当前路由页面
        // 设置第最后元素为当前页面
        this.$router.push(`/${this.breadcrumbsList[this.breadcrumbsList.length - 1].path}`)
      }

    },

    // 接收歌曲事件
    musicListen() {

      this.$bus.on("send-songData", (song) => {
        console.log("歌曲信息=>", song)
        if (song) {
          this.audioData = {
            name: song.name,
            artist: '',
            url: song.sourceFile,
            cover: '',
            theme: '#1aaee1',
            lrc: song.lyric,
          }
          this.$bus.emit("send-audioData", this.audioData)

        }
      })
    },
    // 监听 面包屑导航栏事件
    breadcrumbsListen() {

      this.$bus.on("notifyBreadcrumbs", (menu) => {
        if (menu.parentId === '0') {
          return;
        } else {
          if (this.breadcrumbsList.length >= 10) {
            this.breadcrumbsList.pop()
          }
          this.breadcrumbsList.push(menu)
          this.breadcrumbsList = this.breadcrumbsList
              .filter((value, index, self) => self.indexOf(value) === index);
          this.saveBreadcrumbsListen()
        }
      })
    },
    // 监听通知
    listen() {
      this.$bus.on('myMessage', (notice) => {
        this.noticeList.push(JSON.parse(notice).data)
        this.noticeList.reverse()
        this.saveNoticeMessage()
      })

      this.$bus.on('AllMessage', (notice) => {
        this.noticeList.push(JSON.parse(notice).data)
        this.noticeList.reverse()
        this.saveNoticeMessage()
      })
    },
    saveNoticeMessage() {
      Cookie.setLocalKeyValue(Cookie.NOTICEMESSAGE, this.noticeList)

    },
    initBreadcrumbsListen() {
      if (Cookie.getLocalValue(Cookie.BREADCRUMBSLISTEN)) {
        this.breadcrumbsList = Cookie.getLocalValue(Cookie.BREADCRUMBSLISTEN)
      }
    },
    saveBreadcrumbsListen() {
      Cookie.setLocalKeyValue(Cookie.BREADCRUMBSLISTEN, this.breadcrumbsList)
    }
  },
  beforeUnmount() {
    this.$bus.off("myMessage")
    this.$bus.off("AllMessage")
    this.$bus.off("send-songData")
    this.$bus.off("send-audioData")

    // 消息保存到本地中,没有消息从服务器获取
    this.saveNoticeMessage();
  },
  mounted() {
    this.menuData = Cookie.getLocalValue(Cookie.MENULIST)
    // console.log(this.$router.options.routes);
    window.addEventListener('keydown', this.handelSpace);
    this.noticeList = Cookie.getLocalValue(Cookie.NOTICEMESSAGE)
    if (!this.noticeList) {
      this.noticeList = []
    }
  },
  created() {
    this.listen()
    this.musicListen()
    this.initBreadcrumbsListen()
    this.breadcrumbsListen()

  }
}
</script>


<style lang="css">

</style>
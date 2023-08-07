<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          <q-avatar>
            <img src="../../assets/logo.svg">
          </q-avatar>
          Jilijili-Admin v1.0.0
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer"/>
      </q-toolbar>

      <!--      TODO 导航栏-->
      <!--      <q-tabs align="left">-->
      <!--        <q-route-tab to="/page1" label="Page One" />-->
      <!--        <q-route-tab to="/page2" label="Page Two" />-->
      <!--        <q-route-tab to="/page3" label="Page Three" />-->
      <!--      </q-tabs>-->
    </q-header>

    <q-drawer v-model="leftDrawerOpen" no-swipe-backdrop side="left" :breakpoint="700" bordered>
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <Menus :menu-data="menuData"/>
        </div>
      </q-scroll-area>

    </q-drawer>


    <q-drawer v-model="rightDrawerOpen" side="right" behavior="mobile" overlay bordered>
      <!-- drawer content -->
      <right/>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer reveal bordered class="bg-black" @keydown.space.prevent="handelSpace">
      <aplayer :audio="audioData" style="height: 100%;width: 100%"/>
    </q-footer>
  </q-layout>
</template>

<script>
import {ref} from 'vue'
import Menus from "@/layout/menu/index.vue";
import aplayer from "@/layout/aplayer/index.vue";
import right from "@/layout/right/index.vue"
import Cookie from "@/boot/cookie";


export default {
  components: {
    Menus,
    aplayer,
    right
  },
  setup() {
    const leftDrawerOpen = ref(true)
    const rightDrawerOpen = ref(false)
    return {
      menuData: [],
      audioData: {
        name: ' ',
        artist: ' ',
        url: ' ',
        cover: ' ',
        lrc: ' ',
      },
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
  methods: {

    // 按下空格是事件
    handelSpace(event) {
      if (event.keyCode === 32 || event.key === " ") {
        event.preventDefault();
        // 发送播放或者暂停事件
        this.$bus.emit("send-playOr-pause", true)
      }
    }
  },
  mounted() {
    this.menuData = Cookie.getLocalValue(Cookie.MENULIST)
    console.log(this.$router.options.routes);

    window.addEventListener('keydown', this.handelSpace);

  },
  created() {
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
  }
}
</script>

<style lang="css" scoped>


</style>
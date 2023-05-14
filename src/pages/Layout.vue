<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          肌理音乐后台
        </q-toolbar-title>
        <q-space/>
        <q-avatar color="teal" text-color="white">
          {{ nicknameFastWord }}
          <q-menu fit anchor="bottom middle"
                  self="top start"
                  transition-show="rotate"
                  transition-hide="rotate">
            <q-item clickable>
              <q-item-section>个人信息</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>系统设置</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>退出</q-item-section>
            </q-item>
          </q-menu>
        </q-avatar>
      </q-toolbar>

    </q-header>
    <q-drawer
      show-if-above
      elevated
      v-model="leftDrawerOpen"
      side="left"
      :width="210"
      content-class="column"
      class="drawer-menu gt-md"
      bordered>
      <q-card class="my-card " flat>
        <q-card-section>
          <q-card-section class="card-section-content">
            <q-img fit="scale-down" src="/images/logo-lg.png"/>
            <q-tooltip anchor="center right" self="center left">欢迎使用</q-tooltip>
          </q-card-section>
        </q-card-section>
      </q-card>
      <q-separator/>
      <menus :menu-list="routerList" :level="1"></menus>
    </q-drawer>


    <q-page-container>
      <router-view/>
      <chat-fab v-if="false"></chat-fab>
      <br>
    </q-page-container>
  </q-layout>
</template>

<script>
import {computed} from 'vue'
import menus from "./menu/Index.vue"
import chatFab from "./chat/Index.vue"

export default {
  // name: Layout,
  components: {
    menus,
    chatFab,
  },
  data() {
    return {
      routerList: this.routerList = this.$router.options.routes[0].children,
      nicknameFastWord: computed(() => this.$store.getters["nicknameFastWord"]),
      leftDrawerOpen: false,
    }
  },
  methods: {

    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    handleLogout() {
      $q.dialog({
        dark: false,
        title: '退出',
        message: '确定要退出吗?',
        cancel: "取消",
        ok: "确定,马上退出",
        persistent: true,

      }).onOk(() => {
        this.$store.dispatch("logout").then(() => window.location.reload())
      }).onOk(() => {
        this.$store.dispatch("logout").then(() => window.location.reload())
      }).onCancel(() => {

      }).onDismiss(() => {
      })

    }
  },
  mounted() {


  }
}
</script>

<style scoped lang="less">

</style>

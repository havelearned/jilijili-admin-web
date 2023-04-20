<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          肌理音乐后台
        </q-toolbar-title>
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

    <div class="fixed" style="height: 100%;">
      <q-drawer show-if-above
                v-model="leftDrawerOpen"
                side="left"
                bordered>
        <menus></menus>
      </q-drawer>
    </div>


    <q-page-container>
      <router-view/>
      <chat-fab v-if="false"></chat-fab>
      <br>
    </q-page-container>
  </q-layout>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from "vuex";
import menus from "./menu/Index.vue"
import chatFab from "./chat/Index.vue"


import {useQuasar} from 'quasar'

export default {
  // name: Layout,
  components: {
    menus,
    chatFab,
  },
  setup() {
    const $q = useQuasar()
    const leftDrawerOpen = ref(false)
    const store = useStore();
    return {
      leftDrawerOpen,
      nicknameFastWord: computed(
        () => store.getters["nicknameFastWord"]
      ),
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
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
          store.dispatch("logout").then(() => window.location.reload())
        }).onOk(() => {
          store.dispatch("logout").then(() => window.location.reload())
        }).onCancel(() => {

        }).onDismiss(() => {

        })

      }
    }
  }
}
</script>

<style scoped lang="less">

</style>

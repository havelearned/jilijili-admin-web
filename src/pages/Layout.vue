<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          JiLiJiLiMusic

        </q-toolbar-title>
        <q-avatar color="teal" text-color="white">
          {{nicknameFastWord}}
        </q-avatar>
      </q-toolbar>

    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from "vuex";

export default {
  // name: Layout,
  setup() {
    const leftDrawerOpen = ref(false)

    const store = useStore();

    return {
      nicknameFastWord: computed(
        () => store.getters["nicknameFastWord"]
      ),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>

</style>

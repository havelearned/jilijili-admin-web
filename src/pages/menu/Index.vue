<template>
  <div class="page">
    <q-list bordered class="rounded-borders">
      <q-expansion-item v-for="(menu,index) in menus" :key="index" :to="menu.path">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon :name="menu.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ menu.title }}
          </q-item-section>
        </template>
        <q-separator/>

        <q-expansion-item
          v-if="menu.children"
          v-for="(item,index) in menu.children"
          :key="index"
          :to="item.path"
          :header-inset-level="1"
          expand-separator
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon :name="item.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ item.title }}
            </q-item-section>
          </template>
        </q-expansion-item>
      </q-expansion-item>
      <q-separator/>
    </q-list>

  </div>
</template>

<script>
import {useStore} from "vuex";

export default {
  // name: 'menu',
  setup() {
    const store = useStore()
    const menus = store.getters['getMenuRoutes']
    return {
      menus,
    }
  }
}


</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  //background-color: #9C27B0;
}


</style>

<template>

  <q-expansion-item
    v-for="(menu,index) in menus"
    :key="index"
    :to="menu.meta.path"
    :icon="menu.meta.icon || 'toc'"
    :label="menu.meta.title"
    :group="menu.id"
    :hide-expand-icon="!menu.children"
  >
<!--    <Menus v-if="menu.children" :menu-list="menu.children" :level="level+1"></Menus>-->
    <q-expansion-item
      group="semigroup-children"
      v-if="menu.children"
      v-for="(item,index) in menu.children"
      :key="index"
      :to="item.meta.path"
      :icon="item.meta.icon || 'toc'"
      :label="item.meta.title"
      :header-inset-level="1"
      :hide-expand-icon="!!menu.children">
    </q-expansion-item>
  </q-expansion-item>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  name: "menus",
  components: {},
  props:{
    menuList: Array,
    level: Number,
  },
  data(){
    return{

    }

  },
  methods:{

  },

  setup() {
    let router = useRouter()
    const route = router.options.routes;
    const menus = route.at(0).children
    return {
      menus,
    }
  }
}


</script>

<style lang="less" scoped>


</style>

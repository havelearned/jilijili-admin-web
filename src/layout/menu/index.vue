<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
        class="q-gutter-md"
        dense-toggle
        v-for="(item,index) in menuData"
        :hide-expand-icon="!item.children"
        expand-separator
        :key="item.menuId"
        :icon="item.icon"
        :label="item.menuName"
        :default-opened="item.parentId === 0"
        :header-inset-level="level"
        :to="item.menuType === 'C' ? item.path: '' "
        @click="notifyBreadcrumbs(item)"
    >
      <menus v-if="item.children" :menu-data="item.children" :level="level+1"/>
    </q-expansion-item>
  </q-list>

</template>
<script>

export default {
  name: "menus",
  props: {
    "menuData": {
      type: Array,
      default: [],
    },
    "level": {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    testclick() {
      // this.$axios.get('/api/test')
      console.log("得到的菜单列表=>", this.$props.menuData)
    },
    /**
     * 发送通知
     * 通知面包屑导航栏更新
     */
    notifyBreadcrumbs(item) {
      this.$bus.emit("notifyBreadcrumbs", item)

    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>